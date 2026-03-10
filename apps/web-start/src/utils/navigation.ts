// Drop-in replacements for next/navigation hooks
import {
    Link,
    useNavigate,
    useRouterState,
    useParams,
} from '@tanstack/react-router';

export { Link, useParams };

export function useRouter() {
    const navigate = useNavigate();
    return {
        push: (url: string) => navigate({ to: url as any }),
        replace: (url: string) => navigate({ to: url as any, replace: true }),
        back: () => window.history.back(),
        refresh: () => window.location.reload(),
    };
}

export function usePathname() {
    return useRouterState({ select: (s) => s.location.pathname });
}

export function useSearchParams() {
    const search = useRouterState({ select: (s) => s.location.searchStr });
    return new URLSearchParams(search);
}

export function redirect(url: string): never {
    throw new Error(
        'Server-side redirect not available in client context. Use throw redirect() from @tanstack/react-router in loaders.',
    );
}
