import { useEffect, useLayoutEffect, useState } from 'react';

import { isServer } from '@/utils/is-server';

import type { PageHeaderConfig } from './page-header-context';

const useIsomorphicLayoutEffect = isServer() ? useEffect : useLayoutEffect;

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
