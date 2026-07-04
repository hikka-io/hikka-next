import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean | undefined {
    // Start undefined to prevent hydration mismatches; resolve on client
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
        undefined,
    );

    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
        const mql = window.matchMedia(mediaQuery);

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
