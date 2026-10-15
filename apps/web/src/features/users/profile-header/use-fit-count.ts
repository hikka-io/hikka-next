import { type RefObject, useLayoutEffect, useState } from 'react';

const GAP = 8;

/** How many leading items of `measureRef` fit in one line of `containerRef`, keeping room for its last child (the overflow trigger). */
export function useFitCount(
    containerRef: RefObject<HTMLElement | null>,
    measureRef: RefObject<HTMLElement | null>,
    count: number,
) {
    const [fit, setFit] = useState(count);

    useLayoutEffect(() => {
        const container = containerRef.current;
        const measure = measureRef.current;
        if (!container || !measure) return;

        const update = () => {
            const widths = [...measure.children].map(
                (child) => child.getBoundingClientRect().width,
            );
            const triggerWidth = widths.pop() ?? 0;
            const style = getComputedStyle(container);
            const available =
                container.clientWidth -
                Number.parseFloat(style.paddingLeft) -
                Number.parseFloat(style.paddingRight);
            let used = 0;
            let next = 0;

            for (const [index, width] of widths.entries()) {
                const isLast = index === widths.length - 1;
                const needed =
                    used +
                    (index ? GAP : 0) +
                    width +
                    (isLast ? 0 : GAP + triggerWidth);

                if (needed > available) break;
                used += (index ? GAP : 0) + width;
                next++;
            }

            setFit(next === widths.length ? next : Math.max(next, 1));
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(container);
        observer.observe(measure);

        return () => observer.disconnect();
    }, [containerRef, measureRef]);

    return fit;
}
