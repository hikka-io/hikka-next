'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook to prevent closing browser tab/window when there's unsaved content
 *
 * @param hasUnsavedContent - Boolean indicating if there's unsaved content
 */
export function usePreventUnsavedClose(hasUnsavedContent: boolean) {
    const handlerRef = useRef<((e: BeforeUnloadEvent) => void) | null>(null);

    useEffect(() => {
        if (handlerRef.current) {
            window.removeEventListener('beforeunload', handlerRef.current);
            handlerRef.current = null;
        }

        if (hasUnsavedContent) {
            const handleBeforeUnload = (e: BeforeUnloadEvent) => {
                e.preventDefault();
            };

            handlerRef.current = handleBeforeUnload;
            window.addEventListener('beforeunload', handleBeforeUnload);
        }

        return () => {
            if (handlerRef.current) {
                window.removeEventListener('beforeunload', handlerRef.current);
                handlerRef.current = null;
            }
        };
    }, [hasUnsavedContent]);
}
