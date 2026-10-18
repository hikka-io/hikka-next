import { type RefObject, useEffect } from 'react';

/** A single image keeps its own aspect ratio; larger groups use the CSS grid ratios. */
export function useImageGroupRatio(
    ref: RefObject<HTMLElement | null>,
    children: unknown[],
) {
    useEffect(() => {
        const container = ref.current;
        if (!container || children.length !== 1) return;

        const img = container.querySelector('img');
        if (!img) return;

        const calculateRatio = () => {
            const ratio = (img.naturalHeight / img.naturalWidth) * 100;
            container.style.setProperty('--ratio', `${ratio}%`);
        };

        if (img.complete && img.naturalHeight !== 0) {
            calculateRatio();
        } else {
            img.addEventListener('load', calculateRatio);
        }

        return () => {
            img.removeEventListener('load', calculateRatio);
            container.style.removeProperty('--ratio');
        };
    }, [ref, children]);
}
