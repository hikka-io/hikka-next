import { BlockSelectionPlugin } from '@platejs/selection/react';
import { RangeApi } from 'platejs';

export const BlockSelectionKit = [
    BlockSelectionPlugin.configure({
        options: {
            isSelectable: (_element, path) => path.length === 1,
        },
    }).overrideEditor(({ editor, api }) => ({
        transforms: {
            // The plugin's own first press selects every block (its `isAt` check returns early),
            // so Cmd+A selects the current line's text first, as Notion does.
            selectAll() {
                const block = editor.api.block();
                const selection = editor.selection;

                if (block && selection && !editor.api.isEmpty(block[0])) {
                    const [start, end] = RangeApi.edges(selection);
                    const coversBlock =
                        editor.api.isStart(start, block[1]) &&
                        editor.api.isEnd(end, block[1]);

                    if (editor.api.isAt({ block: true }) && !coversBlock) {
                        editor.tf.select(block[1]);
                        return true;
                    }
                }

                api.blockSelection.selectAll();
                return true;
            },
        },
    })),
];
