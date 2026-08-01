import type * as React from 'react';

import { EyeOffIcon } from 'lucide-react';
import { useEditorRef, useEditorSelector } from 'platejs/react';

import { ELEMENT_SPOILER } from '../editor/plugins/spoiler-kit';
import { isInsideBlock, toggleContainerBlock } from '../editor/transforms';
import { ToolbarButton } from './toolbar';

export function SpoilerToolbarButton(
    props: React.ComponentProps<typeof ToolbarButton>,
) {
    const editor = useEditorRef();
    const isActive = useEditorSelector(
        (editor) => isInsideBlock(editor, ELEMENT_SPOILER),
        [],
    );

    return (
        <ToolbarButton
            {...props}
            pressed={isActive}
            onClick={() => {
                toggleContainerBlock(editor, ELEMENT_SPOILER);
                editor.tf.focus();
            }}
            onMouseDown={(e) => e.preventDefault()}
            tooltip="Спойлер"
        >
            <EyeOffIcon />
        </ToolbarButton>
    );
}
