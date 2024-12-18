import {
    TElement,
    getPluginType,
    isElement,
    isText,
    wrapNodeChildren,
} from '@udecode/plate-common';
import type { ExtendEditor } from '@udecode/plate-common/react';

import { SpoilerPlugin } from './spoiler-plugin';

export const withSpoiler: ExtendEditor = ({ editor }) => {
    const { shouldMergeNodesRemovePrevNode, normalizeNode } = editor;

    if (shouldMergeNodesRemovePrevNode) {
        editor.shouldMergeNodesRemovePrevNode = (
            prevNodeEntry,
            curNodeEntry,
        ) => {
            const prevNode = prevNodeEntry[0] as TElement;

            if (prevNode.type === SpoilerPlugin.key) return false;

            return shouldMergeNodesRemovePrevNode(prevNodeEntry, curNodeEntry);
        };
    }

    editor.normalizeNode = ([node, path]) => {
        if (isElement(node)) {
            if (node.type === getPluginType(editor, SpoilerPlugin)) {
                const { children } = node;

                if (isText(children[0])) {
                    wrapNodeChildren(
                        editor,
                        {
                            type: 'p',
                            children: [],
                        },
                        {
                            at: path,
                        },
                    );

                    return;
                }
            }
        }

        normalizeNode([node, path]);
    };

    return editor;
};
