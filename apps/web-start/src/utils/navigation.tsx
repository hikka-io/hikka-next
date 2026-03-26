import {
    Link as TanStackLink,
    useNavigate,
    useRouterState,
    useParams as useTanstackParams,
} from '@tanstack/react-router';
import type {
    AnyRouter,
    LinkComponentProps,
    NavigateOptions,
} from '@tanstack/react-router';
import { forwardRef } from 'react';

/**
 * Link props derived from TanStack Router's native LinkComponentProps
 * with relaxed `to` typing to allow dynamic URL construction.
 *
 * Uses `string` for all route path generics so any URL string is accepted
 * while preserving the full set of TanStack Router link props
 * (activeProps, inactiveProps, preload, mask, resetScroll, etc.).
 */
export type LinkProps = Omit<
    LinkComponentProps<'a', AnyRouter, string, string, string, string>,
    'to'
> & {
    to: string;
};

const isExternalUrl = (url: string) =>
    url.startsWith('http://') || url.startsWith('https://');

/**
 * App-wide Link component.
 * - Accepts any string URL (not restricted to registered route paths)
 * - External URLs (http/https) render as native <a> tags
 * - Internal URLs use TanStack Router navigation
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
    { to, children, ...rest },
    ref,
) {
    if (isExternalUrl(to)) {
        const { target, rel, className, style, onClick, id, ...htmlProps } =
            rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
        return (
            <a
                ref={ref}
                href={to}
                target={target ?? '_blank'}
                rel={rel ?? 'noopener noreferrer'}
                className={className}
                style={style}
                onClick={onClick}
                id={id}
                {...htmlProps}
            >
                {children as React.ReactNode}
            </a>
        );
    }

    return (
        <TanStackLink ref={ref} to={to as '/'} {...(rest as any)}>
            {children as React.ReactNode}
        </TanStackLink>
    );
});

// Non-strict useParams — works without specifying the route
export function useParams(): Record<string, string> {
    return useTanstackParams({ strict: false });
}

type RelaxedNavigateOptions = Omit<
    NavigateOptions<AnyRouter, string, string, string, string>,
    'to'
> & {
    to?: string;
};

export function useRouter() {
    const navigate = useNavigate();
    return {
        push: (url: string, options?: Omit<RelaxedNavigateOptions, 'to'>) =>
            navigate({ ...options, to: url as '/' } as any),
        replace: (
            url: string,
            options?: Omit<RelaxedNavigateOptions, 'to' | 'replace'>,
        ) => navigate({ ...options, to: url as '/', replace: true } as any),
        back: () => window.history.back(),
        refresh: () => window.location.reload(),
    };
}

export function usePathname() {
    return useRouterState({
        select: (s) => (s.resolvedLocation ?? s.location).pathname,
    });
}
