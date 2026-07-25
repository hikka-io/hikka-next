import { useEffect, useRef, useState } from 'react';

import { useRouter } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { usePathname } from '@/utils/navigation';

import HeaderNavSheet from './header-nav-sheet';
import { usePageHeaderState } from './page-header-context';

const SCROLL_THRESHOLD = 8;

/**
 * Mobile-only page header. It overlays the page, so it stays transparent until
 * the page is scrolled, and it keeps its title hidden while the page still
 * shows its own.
 */
const MobileHeader = () => {
    const { config, anchor } = usePageHeaderState();
    const router = useRouter();
    const pathname = usePathname();
    const headerRef = useRef<HTMLElement>(null);
    const [scrolled, setScrolled] = useState(false);
    const [passedAnchor, setPassedAnchor] = useState(false);

    /**
     * A new screen always starts at rest. Measuring here instead would read the
     * scroll position of the screen we came from, since the router restores
     * scroll after the new one has rendered.
     */
    useEffect(() => {
        setScrolled(false);
        setPassedAnchor(false);
    }, [pathname]);

    useEffect(() => {
        const update = () => {
            setScrolled(window.scrollY > SCROLL_THRESHOLD);
            setPassedAnchor(
                !!anchor &&
                    anchor.getBoundingClientRect().bottom <=
                        (headerRef.current?.offsetHeight ?? 0),
            );
        };

        window.addEventListener('scroll', update, { passive: true });

        return () => window.removeEventListener('scroll', update);
    }, [anchor]);

    if (!config) {
        return null;
    }

    const {
        title,
        subtitle,
        indicatorClassName,
        parent,
        navRoutes,
        navUrlPrefix,
    } = config;

    const goBack = () => {
        if (router.history.canGoBack()) {
            router.history.back();
            return;
        }

        router.navigate({ to: (parent ?? '/') as '/' });
    };

    return (
        <>
            <div className="h-14 md:hidden" />
            <header
                ref={headerRef}
                className={cn(
                    'fixed inset-x-0 top-0 z-30 border-b border-b-transparent bg-transparent pt-[env(safe-area-inset-top)] backdrop-blur transition-[background-color,border-color,backdrop-filter] md:hidden',
                    scrolled &&
                        'border-b-border bg-background/80 backdrop-blur-xl backdrop-saturate-150',
                )}
            >
                <div className="flex h-14 items-center gap-1 px-2">
                    <Button
                        variant="ghost"
                        size="icon-md"
                        className="[&_svg]:size-6"
                        aria-label="Назад"
                        onClick={goBack}
                    >
                        <ChevronLeft />
                    </Button>
                    <div
                        className={cn(
                            'flex min-w-0 flex-1 flex-col justify-center transition-opacity',
                            !anchor || passedAnchor
                                ? 'opacity-100'
                                : 'pointer-events-none opacity-0',
                        )}
                    >
                        <div className="flex min-w-0 items-center gap-2">
                            {indicatorClassName && (
                                <span
                                    className={cn(
                                        'size-2 shrink-0 rounded-full',
                                        indicatorClassName,
                                    )}
                                />
                            )}
                            <span className="truncate font-semibold text-sm">
                                {title}
                            </span>
                        </div>
                        {navRoutes && navUrlPrefix ? (
                            <HeaderNavSheet
                                routes={navRoutes}
                                urlPrefix={navUrlPrefix}
                            />
                        ) : (
                            subtitle && (
                                <span className="truncate text-muted-foreground text-xs">
                                    {subtitle}
                                </span>
                            )
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};

export default MobileHeader;
