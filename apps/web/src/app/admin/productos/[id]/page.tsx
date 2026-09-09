'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { adminUpdateProduct, adminFetchCategories, adminFetchProducts } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [error, setError] = useState('');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: adminFetchCategories,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: adminFetchProducts,
  });

  const product = products?.find((p) => p.id === id);

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
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  
  // Optional Event Info
  const [duration, setDuration] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [attendeeCount, setAttendeeCount] = useState('');

  const [benefits, setBenefits] = useState<string[]>(['']);
  const [objectives, setObjectives] = useState<string[]>(['']);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setSlug(product.slug);
      setTagline(product.tagline);
      setDescription(product.description);
      setPrice(String(product.price));
      setCurrency(product.currency);
      setCategoryId(product.categoryId);
      setFileType(product.fileType);
      setPreviewPages(String(product.previewPages));
      setIsActive(product.isActive);
      setIsFeatured(product.isFeatured);
      setDuration(product.duration || '');
      setTargetAudience(product.targetAudience || '');
      setAttendeeCount(product.attendeeCount || '');
      setBenefits(product.benefits.length ? product.benefits : ['']);
      setObjectives(product.objectives.length ? product.objectives : ['']);
    }
  }, [product]);

  const updateMutation = useMutation({
    mutationFn: (fd: FormData) => adminUpdateProduct(id, fd),
    onSuccess: () => router.push('/admin/productos'),
    onError: (err: Error) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
    fd.append('isActive', String(isActive));
    fd.append('isFeatured', String(isFeatured));
    if (duration) fd.append('duration', duration); else fd.append('duration', '');
    if (targetAudience) fd.append('targetAudience', targetAudience); else fd.append('targetAudience', '');
    if (attendeeCount) fd.append('attendeeCount', attendeeCount); else fd.append('attendeeCount', '');
    fd.append('benefits', JSON.stringify(benefits.filter(Boolean)));
    fd.append('objectives', JSON.stringify(objectives.filter(Boolean)));
    if (productFile) fd.append('file', productFile);
    if (coverFile) fd.append('cover', coverFile);

    updateMutation.mutate(fd);
  };

  const addItem = (list: string[], setter: (v: string[]) => void) =>
    setter([...list, '']);
  const removeItem = (list: string[], setter: (v: string[]) => void, idx: number) =>
    setter(list.filter((_, i) => i !== idx));
  const updateItem = (list: string[], setter: (v: string[]) => void, idx: number, val: string) =>
    setter(list.map((item, i) => (i === idx ? val : item)));

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="text-neutral-500">Producto no encontrado.</p>
        <Button className="mt-4" asChild>
          <Link href="/admin/productos">Volver</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/productos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Editar producto</h1>
          <p className="text-neutral-400 text-sm truncate max-w-xs">{product.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
          <h2 className="font-bold text-neutral-900">Información básica</h2>
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Título</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Slug</label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Tagline</label>
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Descripción</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
            />
          </div>

          {/* Visibility toggles */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-neutral-700">Activo (visible en la tienda)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-neutral-700">Destacado</span>
            </label>
          </div>
        </div>

        {/* Pricing & Category */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
          <h2 className="font-bold text-neutral-900">Precio y categoría</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Precio</label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Categoría</label>
            <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
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

        {/* Files (optional replace) */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
          <h2 className="font-bold text-neutral-900">Reemplazar archivos (opcional)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Tipo</label>
              <Select value={fileType} onChange={(e) => setFileType(e.target.value)}>
                <option value="pdf">PDF</option>
                <option value="epub">EPUB</option>
                <option value="zip">ZIP</option>
                <option value="xlsx">Excel</option>
                <option value="docx">Word</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Páginas preview</label>
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
              Nuevo archivo (dejar vacío para no cambiar)
            </label>
            <input
              type="file"
              accept=".pdf,.epub,.zip,.xlsx,.docx"
              onChange={(e) => setProductFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-neutral-700 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-neutral-200 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
              Nueva portada (dejar vacío para no cambiar)
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
            <Button type="button" variant="ghost" size="sm" onClick={() => addItem(benefits, setBenefits)}>
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
                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(benefits, setBenefits, i)}>
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
            <Button type="button" variant="ghost" size="sm" onClick={() => addItem(objectives, setObjectives)}>
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
                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(objectives, setObjectives, i)}>
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
          <Button type="submit" disabled={updateMutation.isPending} className="flex-1 sm:flex-none">
            {updateMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/productos">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
