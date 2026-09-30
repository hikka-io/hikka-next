import * as React from 'react';

import { maxWidth } from '@/utils/breakpoints';
import { isServer } from '@/utils/is-server';

export function useIsMobile(): boolean | undefined {
    // Start undefined to prevent hydration mismatches; resolve on client
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
        undefined,
    );

    React.useEffect(() => {
        if (isServer()) return;

        const mql = window.matchMedia(maxWidth('md'));

        const updateMobileState = () => {
            setIsMobile(mql.matches);
        };

        updateMobileState();

        mql.addEventListener('change', updateMobileState);

        // orientationchange can fire without triggering matchMedia; delay so
        // dimensions settle before re-reading.
        const handleOrientationChange = () => {
            setTimeout(updateMobileState, 100);
        };

        window.addEventListener('orientationchange', handleOrientationChange);

        return () => {
            mql.removeEventListener('change', updateMobileState);
            window.removeEventListener(
                'orientationchange',
                handleOrientationChange,
            );
        };
    }, []);

    return isMobile;
}
