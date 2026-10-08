import { useEffect, useState } from 'react';

// Re-read on close rather than on every render: the editor keeps a stable
// identity, so anything derived from it during render is memoized forever.
export function useClosedSnapshot<T>(isOpen: boolean, read: () => T) {
    const [snapshot, setSnapshot] = useState<T>(read);

    useEffect(() => {
        if (!isOpen) {
            setSnapshot(read());
        }
    }, [isOpen]);

    return snapshot;
}
