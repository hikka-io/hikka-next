import type * as React from 'react';

import { EyeOffIcon } from 'lucide-react';
import { useEditorRef } from 'platejs/react';

import { ELEMENT_SPOILER } from '../editor/plugins/spoiler-kit';
import { insertBlock } from '../editor/transforms';
import { ToolbarButton } from './toolbar';

export function SpoilerToolbarButton(
    props: React.ComponentProps<typeof ToolbarButton>,
) {
    const editor = useEditorRef();

    return (
        <ToolbarButton
            {...props}
            onClick={() => insertBlock(editor, ELEMENT_SPOILER)}
            onMouseDown={(e) => e.preventDefault()}
            tooltip="Спойлер"
        >
            <EyeOffIcon />
        </ToolbarButton>
    );
}
