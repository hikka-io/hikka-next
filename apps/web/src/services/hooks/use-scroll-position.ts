import {
    RefObject,
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
} from 'react';

type ScrollDirection = 'vertical' | 'horizontal';

interface ScrollPositionState {
    hasScrolled: boolean;
    isAtEnd: boolean;
}

interface ScrollGradientMaskState {
    showStartGradient: boolean;
    showEndGradient: boolean;
    showBothGradients: boolean;
    gradientClassName: string;
}

/**
 * Compute the appropriate gradient mask class name based on scroll position and direction.
 */
function computeGradientClassName(
    showStartGradient: boolean,
    showEndGradient: boolean,
    direction: ScrollDirection,
): string {
    const isVertical = direction === 'vertical';

    // For vertical: t (top) = start, b (bottom) = end
    // For horizontal: l (left) = start, r (right) = end
    const startChar = isVertical ? 't' : 'l';
    const endChar = isVertical ? 'b' : 'r';

    if (showStartGradient && showEndGradient) {
        return `gradient-mask-${startChar}-90-d`;
    }
    if (showStartGradient) {
        return `gradient-mask-${startChar}-90`;
    }
    if (showEndGradient) {
        return `gradient-mask-${endChar}-90`;
    }
    return '';
}

const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useScrollPosition(
    containerRef: RefObject<HTMLElement | null>,
    direction: ScrollDirection = 'vertical',
): ScrollPositionState {
    const [hasScrolled, setHasScrolled] = useState<boolean>(false);

    const [isAtEnd, setIsAtEnd] = useState<boolean>(true);

    const isVertical = direction === 'vertical';

    const getScrollPosition = useCallback(
        (container: HTMLElement): number => {
            return isVertical ? container.scrollTop : container.scrollLeft;
        },
        [isVertical],
    );

    const getScrollSize = useCallback(
        (container: HTMLElement): number => {
            return isVertical ? container.scrollHeight : container.scrollWidth;
        },
        [isVertical],
    );

    const getClientSize = useCallback(
        (container: HTMLElement): number => {
            return isVertical ? container.clientHeight : container.clientWidth;
        },
        [isVertical],
    );

    const calculateScrollState = useCallback(
        (container: HTMLElement) => {
            const scrollPos = getScrollPosition(container);
            const scrollSize = getScrollSize(container);
            const clientSize = getClientSize(container);
            const maxScroll = scrollSize - clientSize;

            const isContentShorter = scrollSize <= clientSize;
            const isAtStart = scrollPos === 0;
            const isAtEndPosition =
                isContentShorter || Math.abs(maxScroll - scrollPos) < 1;

            return {
                hasScrolled: !isAtStart && !isContentShorter,
                isAtEnd: isAtEndPosition,
            };
        },
        [getScrollPosition, getScrollSize, getClientSize],
    );

    useIsomorphicLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const initialState = calculateScrollState(container);
        setHasScrolled(initialState.hasScrolled);
        setIsAtEnd(initialState.isAtEnd);
    }, [containerRef, calculateScrollState]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const rafId = requestAnimationFrame(() => {
            const state = calculateScrollState(container);
            setHasScrolled(state.hasScrolled);
            setIsAtEnd(state.isAtEnd);
        });

        const handleScroll = () => {
            const state = calculateScrollState(container);
            setHasScrolled(state.hasScrolled);
            setIsAtEnd(state.isAtEnd);
        };

        const resizeObserver = new ResizeObserver(() => {
            const state = calculateScrollState(container);
            setHasScrolled(state.hasScrolled);
            setIsAtEnd(state.isAtEnd);
        });

        resizeObserver.observe(container);

        Array.from(container.children).forEach((child) => {
            resizeObserver.observe(child);
        });

        container.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            cancelAnimationFrame(rafId);
            resizeObserver.disconnect();
            container.removeEventListener('scroll', handleScroll);
        };
    }, [containerRef, calculateScrollState]);

    return { hasScrolled, isAtEnd };
}

export function useScrollGradientMask(
    containerRef: RefObject<HTMLElement | null>,
    direction: ScrollDirection = 'vertical',
): ScrollGradientMaskState {
    const { hasScrolled, isAtEnd }: ScrollPositionState = useScrollPosition(
        containerRef,
        direction,
    );

    const showStartGradient = hasScrolled;
    const showEndGradient = !isAtEnd;

    return {
        showStartGradient,
        showEndGradient,
        showBothGradients: showStartGradient && showEndGradient,
        gradientClassName: computeGradientClassName(
            showStartGradient,
            showEndGradient,
            direction,
        ),
    };
}
