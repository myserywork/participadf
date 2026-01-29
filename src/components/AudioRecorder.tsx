'use client';

import { useState, useRef, useCallback } from 'react';
import { Mic, Square, Pause, Play, Trash2, Send, RotateCcw } from 'lucide-react';
import { Anexo } from '@/lib/types';
import { formatarTamanhoArquivo, gerarId } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioRecorderProps {
  onSave?: (anexo: Anexo) => void;
  maxDuration?: number; // em segundos
}

export default function AudioRecorder({ 
  onSave, 
  maxDuration = 180 // 3 minutos padrão
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioBlob(blob);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      alert('Não foi possível acessar o microfone.');
    }
  }, [maxDuration]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setIsPaused(false);
  }, []);

  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const discardRecording = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioBlob(null);
    setDuration(0);
    setIsPlaying(false);
  }, [audioUrl]);

  const saveRecording = useCallback(() => {
    if (audioBlob && onSave) {
      const anexo: Anexo = {
        id: gerarId(),
        tipo: 'audio',
        nome: `audio_${new Date().toISOString()}.webm`,
        tamanho: audioBlob.size,
        url: audioUrl || '',
        mimetype: 'audio/webm',
        duracao: duration,
        createdAt: new Date()
      };
      onSave(anexo);
      discardRecording();
    }
  }, [audioBlob, audioUrl, onSave, discardRecording, duration]);

  // Fake waveform bars
  const bars = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!isRecording && !audioUrl ? (
          // Estado Inicial
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center p-8 bg-[var(--bg-elevated)] rounded-3xl border border-[var(--border-primary)] shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={startRecording}
          >
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mic className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Toque para Gravar</h3>
            <p className="text-sm text-[var(--text-secondary)]">Relate sua manifestação por voz</p>
          </motion.div>
        ) : isRecording ? (
          // Estado Gravando
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/30 flex flex-col items-center"
          >
            <div className="text-4xl font-mono font-bold text-red-600 mb-6 tabular-nums">
              {formatDuration(duration)}
            </div>
            
            {/* Visualizer Animado */}
            <div className="flex items-end justify-center gap-1 h-12 mb-8 w-full max-w-[200px]">
              {bars.map((i) => (
                <div
                  key={i}
                  className="w-1.5 bg-red-400 rounded-full animate-wave"
                  style={{
                    animationDuration: `${Math.random() * 0.5 + 0.5}s`,
                    height: '20%'
                  }}
                />
              ))}
            </div>

            <div className="flex gap-4 w-full">
              <button
                onClick={stopRecording}
                className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
              >
                <Square className="w-5 h-5 fill-current" />
                Parar
              </button>
            </div>
            <p className="text-xs text-red-600/60 mt-4">Gravando áudio...</p>
          </motion.div>
        ) : (
          // Estado Review
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-[var(--bg-elevated)] rounded-3xl border border-[var(--border-primary)] shadow-lg"
          >
            <audio 
              ref={audioRef} 
              src={audioUrl || ''} 
              onEnded={() => setIsPlaying(false)} 
              className="hidden"
            />
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayback}
                  className="w-12 h-12 bg-[var(--brand-primary)] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current pl-1" />}
                </button>
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">Áudio Gravado</div>
                  <div className="text-xs text-[var(--text-secondary)]">{formatDuration(duration)}</div>
                </div>
              </div>
              
              {/* Fake waveform static */}
              <div className="hidden sm:flex items-center gap-0.5 h-8 opacity-50">
                {bars.slice(0, 10).map((i) => (
                  <div key={i} className="w-1 bg-[var(--text-secondary)] rounded-full" style={{ height: `${Math.random() * 80 + 20}%` }} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={discardRecording}
                className="py-3 px-4 rounded-xl border-2 border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Apagar
              </button>
              <button
                onClick={saveRecording}
                className="py-3 px-4 rounded-xl bg-green-600 text-white hover:bg-green-700 font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-green-500/20"
              >
                <Send className="w-4 h-4" />
                Anexar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
        @keyframes wave {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}