import { useEffect, useRef } from 'react';

// Warns before tab/window close while there is unsaved content.
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
