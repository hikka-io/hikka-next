import { useEffect, useState } from 'react';

import TextExpand from '@/components/text-expand';
import { Button } from '@/components/ui/button';

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

function EditorPreviewFrame({
    isEmpty,
    icon,
    buttonTitle,
    children,
    ...props
}: React.ComponentProps<typeof Button> & {
    isEmpty: boolean;
    icon: React.ReactNode;
    buttonTitle: string;
}) {
    if (isEmpty) {
        return (
            <Button variant="outline" className="w-full" {...props}>
                {icon}
                {buttonTitle}
            </Button>
        );
    }

    return (
        <div className="flex w-full flex-col gap-2">
            <div className="w-full rounded-lg border p-4 text-left">
                <TextExpand>{children}</TextExpand>
            </div>
            <Button variant="outline" className="w-full" {...props}>
                {icon}
                {buttonTitle}
            </Button>
        </div>
    );
}

export default EditorPreviewFrame;
