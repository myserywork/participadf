import { v4 as uuidv4 } from 'uuid';

/**
 * Gera um número de protocolo único no formato:
 * PARTICIPADF-AAAAMM-XXXXXXXX
 * Exemplo: PARTICIPADF-202601-A1B2C3D4
 */
export function gerarProtocolo(): string {
  const now = new Date();
  const ano = now.getFullYear();
  const mes = String(now.getMonth() + 1).padStart(2, '0');
  const uuid = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
  
  return `PARTICIPADF-${ano}${mes}-${uuid}`;
}

/**
 * Formata o protocolo para exibição com espaços
 */
export function formatarProtocolo(protocolo: string): string {
  // PARTICIPADF-202601-A1B2C3D4 -> PARTICIPADF - 2026/01 - A1B2C3D4
  const partes = protocolo.split('-');
  if (partes.length === 3) {
    const anoMes = partes[1];
    const ano = anoMes.substring(0, 4);
    const mes = anoMes.substring(4, 6);
    return `${partes[0]} - ${ano}/${mes} - ${partes[2]}`;
  }
  return protocolo;
}

/**
 * Valida formato do protocolo
 */
export function validarProtocolo(protocolo: string): boolean {
  const regex = /^PARTICIPADF-\d{6}-[A-Z0-9]{8}$/;
  return regex.test(protocolo.toUpperCase().trim());
}

/**
 * Formata data para exibição
 */
export function formatarData(data: Date | string): string {
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formata data curta
 */
export function formatarDataCurta(data: Date | string): string {
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formata tamanho de arquivo
 */
export function formatarTamanhoArquivo(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Valida email
 */
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida telefone brasileiro
 */
export function validarTelefone(telefone: string): boolean {
  const limpo = telefone.replace(/\D/g, '');
  return limpo.length >= 10 && limpo.length <= 11;
}

/**
 * Formata telefone
 */
export function formatarTelefone(telefone: string): string {
  const limpo = telefone.replace(/\D/g, '');
  if (limpo.length === 11) {
    return `(${limpo.substring(0, 2)}) ${limpo.substring(2, 7)}-${limpo.substring(7)}`;
  } else if (limpo.length === 10) {
    return `(${limpo.substring(0, 2)}) ${limpo.substring(2, 6)}-${limpo.substring(6)}`;
  }
  return telefone;
}

/**
 * Valida CPF
 */
export function validarCPF(cpf: string): boolean {
  const limpo = cpf.replace(/\D/g, '');
  
  if (limpo.length !== 11) return false;
  if (/^(\d)\1+$/.test(limpo)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(limpo.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(limpo.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(limpo.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(limpo.charAt(10))) return false;
  
  return true;
}

/**
 * Formata CPF
 */
export function formatarCPF(cpf: string): string {
  const limpo = cpf.replace(/\D/g, '');
  if (limpo.length === 11) {
    return `${limpo.substring(0, 3)}.${limpo.substring(3, 6)}.${limpo.substring(6, 9)}-${limpo.substring(9)}`;
  }
  return cpf;
}

/**
 * Remove acentos de string
 */
export function removerAcentos(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Trunca texto com reticências
 */
export function truncarTexto(texto: string, maxLength: number): string {
  if (texto.length <= maxLength) return texto;
  return texto.substring(0, maxLength - 3) + '...';
}

/**
 * Gera ID único
 */
export function gerarId(): string {
  return uuidv4();
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Verifica se está online
 */
export function isOnline(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

/**
 * Verifica suporte a recursos do navegador
 */
export const browserSupport = {
  mediaRecorder: () => typeof MediaRecorder !== 'undefined',
  getUserMedia: () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
  speechRecognition: () => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
  serviceWorker: () => 'serviceWorker' in navigator,
  notification: () => 'Notification' in window,
  localStorage: () => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch {
      return false;
    }
  },
  indexedDB: () => 'indexedDB' in window,
};

/**
 * Classe para gerenciar armazenamento local com fallback
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
    }
  }
};
