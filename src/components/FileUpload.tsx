'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Camera, FileText, CheckCircle } from 'lucide-react';
import { formatarTamanhoArquivo, gerarId } from '@/lib/utils';
import { Anexo } from '@/lib/types';

interface FileUploadProps {
  onFileSelect: (anexo: Anexo) => void;
  acceptedTypes?: string;
  maxSize?: number; // em bytes
  label?: string;
}

export default function FileUpload({
  onFileSelect,
  acceptedTypes = 'image/*,.pdf,.doc,.docx',
  maxSize = 10 * 1024 * 1024, // 10MB padrão
  label = 'Arraste arquivos ou clique para selecionar'
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxSize) {
      return `Arquivo "${file.name}" muito grande. Tamanho máximo: ${formatarTamanhoArquivo(maxSize)}`;
    }
    return null;
  }, [maxSize]);

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    let addedCount = 0;
    const errors: string[] = [];

    fileArray.forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(validationError);
        return;
      }

      const tipo = file.type.startsWith('image/') ? 'imagem' : 'documento';

      // Para imagens, criar URL de preview
      let url = URL.createObjectURL(file);

      const anexo: Anexo = {
        id: gerarId(),
        tipo: tipo as 'imagem' | 'documento',
        nome: file.name,
        tamanho: file.size,
        url: url,
        mimetype: file.type,
        createdAt: new Date()
      };

      onFileSelect(anexo);
      addedCount++;
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
    } else {
      setError(null);
    }

    if (addedCount > 0) {
      setSuccessMessage(`${addedCount} arquivo(s) adicionado(s)!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }

    // Limpa o input para permitir selecionar o mesmo arquivo novamente
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [validateFile, onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  return (
    <div className="space-y-4">
      {/* Área de upload */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
          ${error ? 'border-red-500 bg-red-50' : ''}
          ${successMessage ? 'border-green-500 bg-green-50' : ''}
        `}
        role="button"
        tabIndex={0}
        aria-label={label}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
          multiple
        />

        <div className="space-y-3">
          {successMessage ? (
            <>
              <CheckCircle className="w-12 h-12 mx-auto text-green-500" aria-hidden="true" />
              <p className="text-green-600 font-medium">{successMessage}</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto text-gray-400" aria-hidden="true" />
              <p className="text-gray-600 font-medium">{label}</p>
              <p className="text-sm text-gray-400">
                Tamanho máximo por arquivo: {formatarTamanhoArquivo(maxSize)}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm whitespace-pre-line" role="alert">
          {error}
        </div>
      )}

      {/* Botões de captura rápida */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.accept = 'image/*';
              inputRef.current.capture = 'environment';
              inputRef.current.click();
            }
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          aria-label="Tirar foto"
        >
          <Camera className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium">Tirar Foto</span>
        </button>

        <button
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.accept = '.pdf,.doc,.docx';
              inputRef.current.removeAttribute('capture');
              inputRef.current.click();
            }
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          aria-label="Anexar documento"
        >
          <FileText className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium">Documento</span>
        </button>
      </div>
    </div>
  );
}
