import { useEffect } from 'react';

import { Uniwind } from 'uniwind';

import { brandTokens } from '@hikka/core';

import { useSessionUI } from '@/services/session';

/**
 * Applies the viewer's brand color to the theme tokens that derive from it (the primary trio and
 * the brand itself), per scheme, so every `bg-primary` and tint follows it. Renders nothing.
 */
const UserStylesEffect = () => {
    const { styles } = useSessionUI();
    const l = styles.brand?.l;
    const c = styles.brand?.c;
    const h = styles.brand?.h;

    useEffect(() => {
        const tokens = brandTokens(
            l === undefined || c === undefined || h === undefined
                ? undefined
                : { l, c, h },
        );

        Uniwind.updateCSSVariables('light', tokens.light);
        Uniwind.updateCSSVariables('dark', tokens.dark);
    }, [l, c, h]);

    return null;
};

export default UserStylesEffect;
