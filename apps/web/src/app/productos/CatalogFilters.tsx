'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { Category } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CatalogFiltersProps {
  categories: Category[];
}

export function CatalogFilters({ categories }: CatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') ?? '';
  const currentSearch = searchParams.get('search') ?? '';

  const [search, setSearch] = useState(currentSearch);

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page'); // reset page on filter change
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter('search', search);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </form>

      {/* Category pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={currentCategory === '' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('category', '')}
        >
          Todos
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={currentCategory === cat.slug ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('category', cat.slug)}
          >
            {cat.icon && <span className="mr-1">{cat.icon}</span>}
            {cat.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
