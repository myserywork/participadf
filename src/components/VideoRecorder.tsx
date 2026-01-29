'use client';

import { useState, useRef, useCallback } from 'react';
import { Video, Square, Pause, Play, Trash2, Send, RotateCcw, Camera } from 'lucide-react';
import { formatarTamanhoArquivo, gerarId } from '@/lib/utils';
import { Anexo } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoRecorderProps {
  onSave?: (anexo: Anexo) => void;
  maxDuration?: number;
}

export default function VideoRecorder({ 
  onSave, 
  maxDuration = 120 
}: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setIsCameraReady(true);
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Não foi possível acessar a câmera.');
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
  }, []);

  const handleSwitchCamera = async () => {
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const newMode = facingMode === 'user' ? 'environment' : 'user';
      setFacingMode(newMode);
      
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: {
              facingMode: newMode,
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: true
          });
          
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
          }
      } catch (err) {
          console.error("Erro ao trocar câmera", err);
      }
  };


  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    try {
        const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp9,opus'
        });
        
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            chunksRef.current.push(event.data);
        }
        };

        mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setVideoBlob(blob);
        stopCamera();
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
    } catch (e) {
        console.error("Erro ao iniciar gravação", e);
        alert("Erro ao iniciar gravação. Tente outro navegador.");
    }
  }, [maxDuration, stopCamera]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setIsPaused(false);
  }, []);

  const discardRecording = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setVideoBlob(null);
    setDuration(0);
    setIsCameraReady(false);
  }, [videoUrl]);

  const saveRecording = useCallback(() => {
    if (videoBlob && onSave) {
      const anexo: Anexo = {
        id: gerarId(),
        tipo: 'video',
        nome: `video_${new Date().toISOString()}.webm`,
        tamanho: videoBlob.size,
        url: videoUrl || '',
        mimetype: 'video/webm',
        duracao: duration,
        createdAt: new Date()
      };
      
      onSave(anexo);
      discardRecording();
    }
  }, [videoBlob, videoUrl, onSave, discardRecording, duration]);

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!isCameraReady && !videoUrl ? (
          // Estado Inicial
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center p-8 bg-[var(--bg-elevated)] rounded-3xl border border-[var(--border-primary)] shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={startCamera}
          >
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Camera className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Gravar Vídeo</h3>
            <p className="text-sm text-[var(--text-secondary)]">Registre sua manifestação em vídeo</p>
          </motion.div>
        ) : !videoUrl ? (
          // Estado Camera / Gravando
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative rounded-3xl overflow-hidden bg-black aspect-video shadow-lg"
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover transform scale-x-[-1] " // Espelhar vídeo frontal (padrão) - ajustar se environment
              style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
              autoPlay
              muted
              playsInline
            />
            
            {/* Controles Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 flex flex-col justify-between">
               <div className="flex justify-between items-start">
                   {isRecording && (
                       <div className="flex items-center gap-2 px-3 py-1 bg-red-500/90 rounded-full backdrop-blur-sm">
                           <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                           <span className="text-white font-mono text-sm font-bold">{formatDuration(duration)}</span>
                       </div>
                   )}
                   {!isRecording && (
                       <button onClick={handleSwitchCamera} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white ml-auto hover:bg-white/30 transition-colors">
                           <RotateCcw className="w-5 h-5" />
                       </button>
                   )}
               </div>

               <div className="flex justify-center items-center gap-6 pb-2">
                   {!isRecording ? (
                       <button
                           onClick={startRecording}
                           className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                       >
                           <div className="w-14 h-14 bg-red-500 rounded-full" />
                       </button>
                   ) : (
                       <button
                           onClick={stopRecording}
                           className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                       >
                           <div className="w-8 h-8 bg-red-500 rounded-sm" />
                       </button>
                   )}
                   
                   {!isRecording && (
                       <button 
                        onClick={stopCamera}
                        className="absolute right-4 bottom-6 text-white text-sm font-medium hover:text-white/80"
                       >
                           Cancelar
                       </button>
                   )}
               </div>
            </div>
          </motion.div>
        ) : (
          // Estado Review
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-[var(--bg-elevated)] rounded-3xl border border-[var(--border-primary)] shadow-lg"
          >
             <div className="rounded-2xl overflow-hidden bg-black aspect-video mb-4 relative group">
                <video 
                    src={videoUrl} 
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                />
             </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={discardRecording}
                className="py-3 px-4 rounded-xl border-2 border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Descartar
              </button>
              <button
                onClick={saveRecording}
                className="py-3 px-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
              >
                <Send className="w-4 h-4" />
                Anexar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}