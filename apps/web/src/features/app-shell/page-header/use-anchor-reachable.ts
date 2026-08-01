import { type RefObject, useEffect, useState } from 'react';

/**
 * Whether the page has enough scroll room to ever push the anchor under the
 * header. Short pages can never satisfy the intersection check, so the header
 * would stay empty forever.
 */
export const useAnchorReachable = (
    anchor: HTMLElement | null,
    headerRef: RefObject<HTMLElement | null>,
) => {
    const [reachable, setReachable] = useState(true);

    useEffect(() => {
        if (!anchor) {
            setReachable(true);

            return;
        }

        const update = () => {
            const headerHeight = headerRef.current?.offsetHeight ?? 0;
            const maxScroll =
                document.documentElement.scrollHeight - window.innerHeight;
            const anchorBottom =
                anchor.getBoundingClientRect().bottom + window.scrollY;

            setReachable(anchorBottom - maxScroll <= headerHeight);
        };

        update();

        const observer = new ResizeObserver(update);
        observer.observe(document.documentElement);
        observer.observe(anchor);
        window.addEventListener('resize', update);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', update);
        };
    }, [anchor, headerRef]);

    return reachable;
};
