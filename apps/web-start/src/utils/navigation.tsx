import {
    Link as TanStackLink,
    useNavigate,
    useRouterState,
    useParams as useTanstackParams,
} from '@tanstack/react-router';
import { forwardRef } from 'react';

/**
 * Link props with relaxed `to` typing.
 * TanStack Router's Link enforces strict route-based types on `to`,
 * but this codebase constructs URLs dynamically (template literals, maps, etc.).
 * This interface accepts any string while preserving TanStack-specific props.
 */
export interface LinkProps
    extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
    to: string;
    search?: Record<string, unknown>;
    params?: Record<string, string>;
    hash?: string;
    preload?: false | 'intent' | 'viewport' | 'render';
    children?:
        | React.ReactNode
        | ((state: { isActive: boolean }) => React.ReactNode);
}

const isExternalUrl = (url: string) =>
    url.startsWith('http://') || url.startsWith('https://');

/**
 * App-wide Link component.
 * - Accepts any string URL (not restricted to registered route paths)
 * - External URLs (http/https) render as native <a> tags
 * - Internal URLs use TanStack Router navigation
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
    function Link({ to, search, params, hash, preload, children, ...htmlProps }, ref) {
        if (isExternalUrl(to)) {
            return (
                <a
                    ref={ref}
                    href={to}
                    target={htmlProps.target ?? '_blank'}
                    rel={htmlProps.rel ?? 'noopener noreferrer'}
                    {...htmlProps}
                >
                    {children as React.ReactNode}
                </a>
            );
        }

        return (
            <TanStackLink
                ref={ref}
                to={to as '/'}
                search={search as never}
                params={params as never}
                hash={hash}
                preload={preload}
                {...(htmlProps as Record<string, unknown>)}
            >
                {children as React.ReactNode}
            </TanStackLink>
        );
    },
);

// Non-strict useParams — works without specifying the route
export function useParams(): Record<string, string> {
    return useTanstackParams({ strict: false });
}

export function useRouter() {
    const navigate = useNavigate();
    return {
        push: (url: string) => navigate({ to: url as '/' }),
        replace: (url: string) =>
            navigate({ to: url as '/', replace: true }),
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
