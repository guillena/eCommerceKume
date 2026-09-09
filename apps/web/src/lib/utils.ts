import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a price in ARS or USD with the correct locale.
 */
export function formatPrice(amount: number, currency = 'ARS'): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  }
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date string to a readable format in es-AR locale.
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a datetime string.
 */
export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format file size in bytes to a human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Get status label in Spanish.
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pendiente',
    APPROVED: 'Aprobada',
    REJECTED: 'Rechazada',
    CANCELLED: 'Cancelada',
    DELIVERED: 'Entregada',
  };
  return labels[status] ?? status;
}

/**
 * Get status color class for badges.
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
    DELIVERED: 'bg-blue-100 text-blue-800',
  };
  return colors[status] ?? 'bg-gray-100 text-gray-800';
}

/**
 * Build a URL to the API based on the NEXT_PUBLIC_API_URL env var.
 * In production, Next.js rewrites /api/* to the backend, so we use '' as base.
 */
export function apiUrl(path: string): string {
  // With Next.js rewrites we can call /api/* directly in the browser
  return path;
}
