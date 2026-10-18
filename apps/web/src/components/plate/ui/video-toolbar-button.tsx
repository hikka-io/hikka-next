import { Film } from 'lucide-react';
import { useEditorRef } from 'platejs/react';

import { ToolbarButton } from './toolbar';
import { getVideoDialog } from './video-dialog';

export function VideoToolbarButton() {
    const editor = useEditorRef();

    return (
        <ToolbarButton
            onClick={() => getVideoDialog(editor)?.()}
            tooltip="Відео"
            className="relative"
        >
            <Film className="size-4" />
        </ToolbarButton>
    );
}
