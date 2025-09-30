import { RefObject, useEffect, useState } from 'react';

type ScrollDirection = 'vertical' | 'horizontal';

interface ScrollPositionState {
    hasScrolled: boolean;
    isAtEnd: boolean;
}

interface ScrollGradientMaskState {
    showStartGradient: boolean;
    showEndGradient: boolean;
    showBothGradients: boolean;
}

export function useScrollPosition(
    containerRef: RefObject<HTMLElement | null>,
    direction: ScrollDirection = 'vertical',
): ScrollPositionState {
    const [hasScrolled, setHasScrolled] = useState<boolean>(false);
    const [isAtEnd, setIsAtEnd] = useState<boolean>(false);

    useEffect(() => {
        const container: HTMLElement | null = containerRef.current;
        if (!container) return;

        const isVertical = direction === 'vertical';

        // Create a wrapper div to hold our sentinel elements
        const sentinelWrapper = document.createElement('div');
        sentinelWrapper.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    `;

        // Start sentinel - positioned at the very beginning of scrollable area
        const startSentinel = document.createElement('div');
        startSentinel.style.cssText = `
      position: absolute;
      ${isVertical ? 'top: 0; left: 0;' : 'left: 0; top: 0;'}
      width: 1px;
      height: 1px;
      pointer-events: none;
    `;

        // End sentinel - positioned at the end of scrollable content
        const endSentinel = document.createElement('div');
        endSentinel.style.cssText = `
      position: absolute;
      ${isVertical ? 'bottom: 0; left: 0;' : 'right: 0; top: 0;'}
      width: 1px;
      height: 1px;
      pointer-events: none;
    `;

        sentinelWrapper.appendChild(startSentinel);
        sentinelWrapper.appendChild(endSentinel);

        // Ensure container has relative positioning
        const originalPosition = container.style.position;
        if (!originalPosition || originalPosition === 'static') {
            container.style.position = 'relative';
        }

        container.appendChild(sentinelWrapper);

        // Helper functions for direction-specific calculations
        const getScrollPosition = (): number => {
            return isVertical ? container.scrollTop : container.scrollLeft;
        };

        const getScrollSize = (): number => {
            return isVertical ? container.scrollHeight : container.scrollWidth;
        };

        const getClientSize = (): number => {
            return isVertical ? container.clientHeight : container.clientWidth;
        };

        const isAtStart = (): boolean => {
            return getScrollPosition() === 0;
        };

        const isAtEndPosition = (): boolean => {
            const scrollPos = getScrollPosition();
            const maxScroll = getScrollSize() - getClientSize();
            return Math.abs(maxScroll - scrollPos) < 1;
        };

        // Set up Intersection Observer with the container as root
        const observer: IntersectionObserver = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                entries.forEach((entry: IntersectionObserverEntry) => {
                    if (entry.target === startSentinel) {
                        // If start sentinel is fully visible, we're at the start (scroll = 0)
                        // If it's not fully visible, we've scrolled past the start
                        setHasScrolled(!entry.isIntersecting);
                    } else if (entry.target === endSentinel) {
                        // If end sentinel is visible, we're at or near the end
                        setIsAtEnd(entry.isIntersecting);
                    }
                });
            },
            {
                root: container,
                threshold: 1.0, // Require full visibility for precise detection
                rootMargin: '0px',
            },
        );

        // Start observing
        observer.observe(startSentinel);
        observer.observe(endSentinel);

        // Handle case where content is shorter than container
        const checkInitialState = () => {
            const isContentShorter = getScrollSize() <= getClientSize();
            if (isContentShorter) {
                setHasScrolled(false);
                setIsAtEnd(true);
            } else {
                // Check initial scroll position
                setHasScrolled(!isAtStart());
                setIsAtEnd(isAtEndPosition());
            }
        };

        // Run initial check
        checkInitialState();

        // Also listen to scroll events for immediate feedback (as backup)
        const handleScroll = () => {
            setHasScrolled(!isAtStart());
            setIsAtEnd(isAtEndPosition());
        };

        container.addEventListener('scroll', handleScroll, { passive: true });

        // Cleanup function
        return () => {
            observer.disconnect();
            container.removeEventListener('scroll', handleScroll);
            if (sentinelWrapper.parentNode) {
                sentinelWrapper.parentNode.removeChild(sentinelWrapper);
            }
            // Restore original position if we changed it
            if (!originalPosition || originalPosition === 'static') {
                container.style.position = originalPosition || '';
            }
        };
    }, [containerRef, direction]);

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

    return {
        showStartGradient: hasScrolled, // Show gradient at start when scrolled away from beginning
        showEndGradient: !isAtEnd, // Show gradient at end when not at end position
        showBothGradients: hasScrolled && !isAtEnd, // Show both gradients when in middle
    };
}
