'use client';

import { Anexo } from '@/lib/types';
import { formatarTamanhoArquivo } from '@/lib/utils';
import { 
  X, 
  FileText, 
  Image as ImageIcon, 
  Mic, 
  Video, 
  Play,
  Pause,
  Download 
} from 'lucide-react';
import { useState, useRef } from 'react';

interface AnexosListProps {
  anexos: Anexo[];
  onRemove: (id: string) => void;
  readOnly?: boolean;
}

export default function AnexosList({ anexos, onRemove, readOnly = false }: AnexosListProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const getIcon = (tipo: Anexo['tipo']) => {
    switch (tipo) {
      case 'imagem':
        return <ImageIcon className="w-5 h-5 text-blue-500" />;
      case 'audio':
        return <Mic className="w-5 h-5 text-green-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-500" />;
      case 'documento':
        return <FileText className="w-5 h-5 text-orange-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const togglePlay = (anexo: Anexo) => {
    if (anexo.tipo === 'audio') {
      const audio = audioRefs.current[anexo.id];
      if (audio) {
        if (playingId === anexo.id) {
          audio.pause();
          setPlayingId(null);
        } else {
          // Pausa outros
          Object.values(audioRefs.current).forEach(a => a?.pause());
          Object.values(videoRefs.current).forEach(v => v?.pause());
          audio.play();
          setPlayingId(anexo.id);
        }
      }
    } else if (anexo.tipo === 'video') {
      const video = videoRefs.current[anexo.id];
      if (video) {
        if (playingId === anexo.id) {
          video.pause();
          setPlayingId(null);
        } else {
          // Pausa outros
          Object.values(audioRefs.current).forEach(a => a?.pause());
          Object.values(videoRefs.current).forEach(v => v?.pause());
          video.play();
          setPlayingId(anexo.id);
        }
      }
    }
  };

  const handleEnded = () => {
    setPlayingId(null);
  };

  if (anexos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Nenhum anexo adicionado</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-600">
        {anexos.length} {anexos.length === 1 ? 'anexo' : 'anexos'}
      </p>
      
      <ul className="space-y-2" role="list" aria-label="Lista de anexos">
        {anexos.map((anexo) => (
          <li
            key={anexo.id}
            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
          >
            {/* Preview ou ícone */}
            {anexo.tipo === 'imagem' ? (
              <img 
                src={anexo.url} 
                alt={anexo.nome}
                className="w-12 h-12 object-cover rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg">
                {getIcon(anexo.tipo)}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{anexo.nome}</p>
              <p className="text-sm text-gray-500">
                {formatarTamanhoArquivo(anexo.tamanho)}
                {anexo.duracao && ` • ${Math.floor(anexo.duracao / 60)}:${String(Math.floor(anexo.duracao % 60)).padStart(2, '0')}`}
              </p>
              
              {/* Player de áudio escondido */}
              {anexo.tipo === 'audio' && (
                <audio 
                  ref={el => { audioRefs.current[anexo.id] = el; }}
                  src={anexo.url}
                  onEnded={handleEnded}
                  className="hidden"
                />
              )}
              
              {/* Player de vídeo para anexos de vídeo */}
              {anexo.tipo === 'video' && (
                <video 
                  ref={el => { videoRefs.current[anexo.id] = el; }}
                  src={anexo.url}
                  onEnded={handleEnded}
                  className="hidden"
                />
              )}
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2">
              {/* Play/Pause para áudio e vídeo */}
              {(anexo.tipo === 'audio' || anexo.tipo === 'video') && (
                <button
                  onClick={() => togglePlay(anexo)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label={playingId === anexo.id ? 'Pausar' : 'Reproduzir'}
                >
                  {playingId === anexo.id ? (
                    <Pause className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Play className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              )}
              
              {/* Download */}
              <a
                href={anexo.url}
                download={anexo.nome}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label={`Baixar ${anexo.nome}`}
              >
                <Download className="w-5 h-5 text-gray-600" />
              </a>
              
              {/* Remover */}
              {!readOnly && (
                <button
                  onClick={() => onRemove(anexo.id)}
                  className="p-2 hover:bg-red-100 rounded-full transition-colors"
                  aria-label={`Remover ${anexo.nome}`}
                >
                  <X className="w-5 h-5 text-red-500" />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
