import { SlateEditor } from '@udecode/plate';
import {
    serializeMd as _serializeMd,
    serializeMdNodes,
} from '@udecode/plate-markdown';

export function serializeMd({
    editor,
    options,
}: {
    editor: SlateEditor;
    options?: Parameters<typeof serializeMdNodes>['1'];
}) {
    if (
        editor.children.length === 1 &&
        editor.children[0].children[0].text === ''
    ) {
        // editor.removeNodes({ at: [0] });
    }

    return _serializeMd(editor, {
        ...options,
        breakTag: '',
        customNodes: {
            spoiler: {
                serialize: (children) => `:::spoiler\n${children}\n:::\n`,
                type: 'spoiler',
            },
        },
    });
}
