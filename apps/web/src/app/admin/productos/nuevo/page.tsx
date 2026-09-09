'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { adminCreateProduct, adminFetchCategories } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

export default function NuevoProductoPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('ARS');
  const [categoryId, setCategoryId] = useState('');
  const [fileType, setFileType] = useState('pdf');
  const [previewPages, setPreviewPages] = useState('3');
  
  // Optional Event Info
  const [duration, setDuration] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [attendeeCount, setAttendeeCount] = useState('');

  const [benefits, setBenefits] = useState<string[]>(['']);
  const [objectives, setObjectives] = useState<string[]>(['']);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: adminFetchCategories,
  });

  const createMutation = useMutation({
    mutationFn: adminCreateProduct,
    onSuccess: () => router.push('/admin/productos'),
    onError: (err: Error) => setError(err.message),
  });

  const handleSlugFromTitle = (val: string) => {
    setTitle(val);
    if (!slug) {
      setSlug(
        val
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!productFile) {
      setError('Debés subir el archivo del producto.');
      return;
    }

    const fd = new FormData();
    fd.append('title', title);
    fd.append('slug', slug);
    fd.append('tagline', tagline);
    fd.append('description', description);
    fd.append('price', price);
    fd.append('currency', currency);
    fd.append('categoryId', categoryId);
    fd.append('fileType', fileType);
    fd.append('previewPages', previewPages);
    if (duration) fd.append('duration', duration);
    if (targetAudience) fd.append('targetAudience', targetAudience);
    if (attendeeCount) fd.append('attendeeCount', attendeeCount);
    fd.append('benefits', JSON.stringify(benefits.filter(Boolean)));
    fd.append('objectives', JSON.stringify(objectives.filter(Boolean)));
    fd.append('file', productFile);
    if (coverFile) fd.append('cover', coverFile);

    createMutation.mutate(fd);
  };

  const addItem = (list: string[], setter: (v: string[]) => void) =>
    setter([...list, '']);
  const removeItem = (list: string[], setter: (v: string[]) => void, idx: number) =>
    setter(list.filter((_, i) => i !== idx));
  const updateItem = (list: string[], setter: (v: string[]) => void, idx: number, val: string) =>
    setter(list.map((item, i) => (i === idx ? val : item)));

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/productos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Nuevo producto</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
          <h2 className="font-bold text-neutral-900">Información básica</h2>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Título *</label>
            <Input
              value={title}
              onChange={(e) => handleSlugFromTitle(e.target.value)}
              placeholder="Ej. Guía completa de marketing digital"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Slug (URL) *</label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="guia-marketing-digital"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Tagline *</label>
            <Input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Una línea que describe el producto"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Descripción *</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción detallada del producto..."
              rows={5}
              required
            />
          </div>
        </div>

        {/* Pricing & Category */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
          <h2 className="font-bold text-neutral-900">Precio y categoría</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Precio *</label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="9900"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Moneda</label>
              <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Categoría *</label>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Seleccioná una categoría</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Optional Event Info */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
          <h2 className="font-bold text-neutral-900">Información del evento (Opcional)</h2>
          
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Duración</label>
            <Input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Ej: 1 encuentros (80-90 minutos)"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Destinatarios</label>
            <Textarea
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Ej: Docentes, psicopedagogos/as..."
              rows={2}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Cantidad de asistentes</label>
            <Input
              value={attendeeCount}
              onChange={(e) => setAttendeeCount(e.target.value)}
              placeholder="Ej: 20/30 a confirmar"
            />
          </div>
        </div>

        {/* Files */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
          <h2 className="font-bold text-neutral-900">Archivos</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Tipo de archivo</label>
              <Select value={fileType} onChange={(e) => setFileType(e.target.value)}>
                <option value="pdf">PDF</option>
                <option value="epub">EPUB</option>
                <option value="zip">ZIP</option>
                <option value="xlsx">Excel</option>
                <option value="docx">Word</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                Páginas de preview
              </label>
              <Input
                type="number"
                value={previewPages}
                onChange={(e) => setPreviewPages(e.target.value)}
                min="1"
                max="20"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
              Archivo del producto *
            </label>
            <input
              type="file"
              accept=".pdf,.epub,.zip,.xlsx,.docx"
              onChange={(e) => setProductFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-neutral-700 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-neutral-200 cursor-pointer"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
              Imagen de portada
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-neutral-700 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-neutral-200 cursor-pointer"
            />
          </div>
        </div>

        {/* Benefits */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-neutral-900">Beneficios</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addItem(benefits, setBenefits)}
            >
              <Plus className="h-4 w-4" /> Agregar
            </Button>
          </div>
          {benefits.map((b, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={b}
                onChange={(e) => updateItem(benefits, setBenefits, i, e.target.value)}
                placeholder={`Beneficio ${i + 1}`}
              />
              {benefits.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(benefits, setBenefits, i)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Objectives */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-neutral-900">Objetivos</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addItem(objectives, setObjectives)}
            >
              <Plus className="h-4 w-4" /> Agregar
            </Button>
          </div>
          {objectives.map((o, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={o}
                onChange={(e) => updateItem(objectives, setObjectives, i, e.target.value)}
                placeholder={`Objetivo ${i + 1}`}
              />
              {objectives.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(objectives, setObjectives, i)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={createMutation.isPending} className="flex-1 sm:flex-none">
            {createMutation.isPending ? 'Creando...' : 'Crear producto'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/productos">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
