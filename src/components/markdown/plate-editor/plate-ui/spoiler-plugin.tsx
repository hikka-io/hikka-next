import {
    TElement,
    Value,
    createPluginFactory,
    getPluginType,
    getTEditor,
    isElement,
    isText,
    onKeyDownToggleElement,
    wrapNodeChildren,
} from '@udecode/plate-common';

export const ELEMENT_SPOILER = 'spoiler';

export const createSpoilerPlugin = createPluginFactory({
    key: ELEMENT_SPOILER,
    deserializeHtml: {
        rules: [
            {
                validNodeName: 'DIV',
                validClassName: 'spoiler',
            },
        ],
    },
    isElement: true,
    handlers: {
        onKeyDown: onKeyDownToggleElement,
    },
    options: {
        hotkey: ['mod+opt+s', 'mod+shift+s'],
    },
    withOverrides: (editor) => {
        const { normalizeNode } = editor;

        const myEditor = getTEditor<Value>(editor);

        myEditor.normalizeNode = ([node, path]) => {
            if (isElement(node)) {
                if (node.type === getPluginType(editor, ELEMENT_SPOILER)) {
                    const { children } = node;

                    if (isText(children[0])) {
                        wrapNodeChildren<TElement>(
                            editor,
                            editor.blockFactory({}, path),
                            {
                                at: path,
                            },
                        );

                        return;
                    }
                }
            }

            return normalizeNode([node, path]);
        };

        return editor;
    },
});
