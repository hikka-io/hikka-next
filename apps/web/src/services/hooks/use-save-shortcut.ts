import { useEffect, useRef } from 'react';

// `code`, not `key`: on a Cyrillic layout the S key types another letter.
const isSaveShortcut = (event: KeyboardEvent) =>
    (event.metaKey || event.ctrlKey) && event.code === 'KeyS';

/** Runs `onSave` on Ctrl/Cmd+S instead of the browser's "save page". */
export function useSaveShortcut(onSave: () => void) {
    const saveRef = useRef(onSave);

    useEffect(() => {
        saveRef.current = onSave;
    });

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (!isSaveShortcut(event) || event.repeat) return;

            event.preventDefault();
            saveRef.current();
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);
}
