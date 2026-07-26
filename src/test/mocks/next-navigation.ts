export const useRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
});

export const usePathname = () => '/dashboard';

export const useSearchParams = () => new URLSearchParams();

export const redirect = vi.fn();

export const notFound = vi.fn();
