'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart';

function CartHydrator() {
  useEffect(() => {
    // Manually rehydrate the cart store from localStorage after mount
    // This avoids SSR/client HTML mismatch (hydration error)
    useCart.persist.rehydrate();
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <CartHydrator />
      {children}
    </QueryClientProvider>
  );
}
