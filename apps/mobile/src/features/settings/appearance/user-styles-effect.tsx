import { useEffect } from 'react';

import { useSessionUI } from '@/services/session';

import { applyBrand, storeBrand } from './theme-store';

/**
 * Applies the viewer's brand color to the theme tokens that derive from it (the primary trio and
 * the brand itself), per scheme, so every `bg-primary` and tint follows it, and remembers it for the
 * next start. Waits for the saved document: while it loads (or failed) the startup accent stays.
 * Renders nothing.
 */
const UserStylesEffect = () => {
    const { styles, isPending, error } = useSessionUI();
    const l = styles.brand?.l;
    const c = styles.brand?.c;
    const h = styles.brand?.h;
    const ready = !isPending && !error;

    useEffect(() => {
        if (!ready) return;

        const brand =
            l === undefined || c === undefined || h === undefined
                ? undefined
                : { l, c, h };

        applyBrand(brand);
        storeBrand(brand);
    }, [ready, l, c, h]);

    return null;
};

export default UserStylesEffect;
