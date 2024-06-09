import {
    focusEditor,
    insertEmptyElement,
    useEditorRef,
} from '@udecode/plate-common';
import MaterialSymbolsTextureAddRounded from '~icons/material-symbols/texture-add-rounded';

import { withRef } from '@/utils/utils';

import { ELEMENT_SPOILER } from './spoiler-plugin';
import { ToolbarButton } from './toolbar';

export const SpoilerToolbarButton = withRef<typeof ToolbarButton>(
    (rest, ref) => {
        const editor = useEditorRef();

        const handleInsertSpoiler = () => {
            insertEmptyElement(editor, ELEMENT_SPOILER, {
                select: true,
                nextBlock: true,
            });

            focusEditor(editor);
        };

        return (
            <ToolbarButton
                ref={ref}
                tooltip="Спойлер"
                onClick={handleInsertSpoiler}
                {...rest}
            >
                <MaterialSymbolsTextureAddRounded />
            </ToolbarButton>
        );
    },
);
