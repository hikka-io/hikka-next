import type * as React from 'react';

import { EyeOffIcon } from 'lucide-react';
import { useEditorRef, useEditorSelector } from 'platejs/react';

import { ELEMENT_SPOILER, ELEMENT_SPOILER_INLINE } from '../editor/plate-types';
import { isInsideBlock, toggleSpoiler } from '../editor/transforms';
import { ToolbarButton } from './toolbar';

export function SpoilerToolbarButton(
    props: React.ComponentProps<typeof ToolbarButton>,
) {
    const editor = useEditorRef();
    const isActive = useEditorSelector(
        (editor) =>
            isInsideBlock(editor, ELEMENT_SPOILER) ||
            isInsideBlock(editor, ELEMENT_SPOILER_INLINE),
        [],
    );

    return (
        <ToolbarButton
            {...props}
            pressed={isActive}
            onClick={() => {
                toggleSpoiler(editor, {
                    block: ELEMENT_SPOILER,
                    inline: ELEMENT_SPOILER_INLINE,
                });
                editor.tf.focus();
            }}
            onMouseDown={(e) => e.preventDefault()}
            tooltip="Спойлер"
        >
            <EyeOffIcon />
        </ToolbarButton>
    );
}
