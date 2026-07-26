import { useEffect, useRef, useState } from 'react';

import { useMatches, useRouter } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { usePathname } from '@/utils/navigation';

import HeaderNavSheet from './header-nav-sheet';
import {
    usePageHeaderActions,
    usePageHeaderState,
} from './page-header-context';
import { resolveTitleVisibility } from './resolve-title-visibility';

const SCROLL_THRESHOLD = 8;

const MobileHeader = () => {
    const { config, anchor } = usePageHeaderState();
    const { setTitleVisible, setTitleAnimated } = usePageHeaderActions();
    const router = useRouter();
    const pathname = usePathname();

    const headerless = useMatches({
        select: (matches) =>
            matches.some((match) => match.staticData.headerless),
    });
    const headerRef = useRef<HTMLElement>(null);
    const [scrolled, setScrolled] = useState(false);
    const [passedAnchor, setPassedAnchor] = useState(false);
    // Only a mounted anchor can produce a scroll-driven reveal, and that is the
    // one change worth animating. Route swaps drop the anchor first, so this is
    // false in the commit that hides the outgoing title — no fade on navigation.
    const animated = Boolean(config && anchor);

    const titleVisible = resolveTitleVisibility({
        config,
        hasAnchor: Boolean(anchor),
        passedAnchor,
    });

    useEffect(() => {
        setTitleVisible(titleVisible);
    }, [titleVisible, setTitleVisible]);

    useEffect(() => {
        setTitleAnimated(animated);
    }, [animated, setTitleAnimated]);

    // biome-ignore lint/correctness/useExhaustiveDependencies(pathname): reset on every navigation
    useEffect(() => {
        setScrolled(false);
    }, [pathname]);

    useEffect(() => {
        const update = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);

        update();
        window.addEventListener('scroll', update, { passive: true });

        return () => window.removeEventListener('scroll', update);
    }, []);

    useEffect(() => {
        setPassedAnchor(false);

        if (!anchor) {
            return;
        }

        const headerHeight = headerRef.current?.offsetHeight ?? 0;
        const observer = new IntersectionObserver(
            ([entry]) =>
                setPassedAnchor(
                    !entry.isIntersecting &&
                        entry.boundingClientRect.bottom <= headerHeight,
                ),
            { rootMargin: `-${headerHeight}px 0px 0px 0px` },
        );
        observer.observe(anchor);

        return () => observer.disconnect();
    }, [anchor]);

    if (headerless) {
        return null;
    }

    const {
        title,
        subtitle,
        indicatorClassName,
        parent,
        navRoutes,
        navUrlPrefix,
        titleComponent: TitleComponent,
        actionsComponent: ActionsComponent,
    } = config ?? {};

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
                    'fixed inset-x-0 top-0 z-30 border-b border-b-transparent bg-transparent pt-[env(safe-area-inset-top)] backdrop-blur-xs transition-[background-color,border-color,backdrop-filter] md:hidden',
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
                            'flex min-w-0 flex-1 flex-col justify-center',
                            animated && 'transition-opacity',
                            titleVisible
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
                            {TitleComponent ? (
                                <TitleComponent />
                            ) : (
                                <span className="truncate font-semibold text-sm">
                                    {title}
                                </span>
                            )}
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
                    {ActionsComponent && (
                        <div className="flex shrink-0 items-center">
                            <ActionsComponent />
                        </div>
                    )}
                </div>
            </header>
        </>
    );
};

export default MobileHeader;
