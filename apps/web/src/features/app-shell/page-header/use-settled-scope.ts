import { useEffect, useLayoutEffect, useState } from 'react';

import type { PageHeaderConfig } from './page-header-context';

const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const useSettledScope = (
    config: PageHeaderConfig | null,
    anchor: HTMLElement | null,
) => {
    const [settled, setSettled] = useState(false);

    useIsomorphicLayoutEffect(() => {
        setSettled(false);
    }, [config, anchor]);

    useEffect(() => {
        if (settled) {
            return;
        }

        const frame = requestAnimationFrame(() => setSettled(true));

        return () => cancelAnimationFrame(frame);
    }, [settled]);

    return settled;
};
