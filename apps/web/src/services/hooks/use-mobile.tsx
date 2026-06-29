import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean | undefined {
    // Start with false to prevent hydration mismatches, update on client
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
        undefined,
    );

    React.useEffect(() => {
        // Check if we're in a browser environment (SSR safety)
        if (typeof window === 'undefined') return;

        const mediaQuery = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
        const mql = window.matchMedia(mediaQuery);

        // Simple update function without useCallback to avoid hook violations
        const updateMobileState = () => {
            setIsMobile(mql.matches);
        };

        // Set initial state
        updateMobileState();

        // Listen for changes (handles both resize and orientation changes)
        mql.addEventListener('change', updateMobileState);

        // Also listen for orientation changes specifically for mobile devices
        // This handles edge cases where orientation change doesn't trigger matchMedia
        const handleOrientationChange = () => {
            // Small delay to ensure dimensions are updated after orientation change
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
