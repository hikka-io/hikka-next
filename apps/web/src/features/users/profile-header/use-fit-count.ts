import { type RefObject, useLayoutEffect, useState } from 'react';

/** How many leading items of `measureRef` (at most `limit`) fit in one line of `containerRef`, keeping room for its last child (the overflow trigger). */
export function useFitCount(
    containerRef: RefObject<HTMLElement | null>,
    measureRef: RefObject<HTMLElement | null>,
    count: number,
    limit: number,
) {
    const [fit, setFit] = useState(Math.min(count, limit));

    useLayoutEffect(() => {
        const container = containerRef.current;
        const measure = measureRef.current;
        if (!container || !measure) return;

        const update = () => {
            const style = getComputedStyle(container);
            const gap = Number.parseFloat(style.columnGap) || 0;
            const available =
                container.clientWidth -
                Number.parseFloat(style.paddingLeft) -
                Number.parseFloat(style.paddingRight);
            const widths = [...measure.children].map(
                (child) => child.getBoundingClientRect().width,
            );
            const triggerWidth = widths.pop() ?? 0;
            let used = 0;
            let next = 0;

            for (const [index, width] of widths.slice(0, limit).entries()) {
                const isLast = index === widths.length - 1;
                const needed =
                    used +
                    (index ? gap : 0) +
                    width +
                    (isLast ? 0 : gap + triggerWidth);

                if (needed > available) break;
                used += (index ? gap : 0) + width;
                next++;
            }

            setFit(next === widths.length ? next : Math.max(next, 1));
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(container);
        observer.observe(measure);

        return () => observer.disconnect();
    }, [containerRef, measureRef, limit]);

    return fit;
}
