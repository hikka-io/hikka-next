import { ElementApi, TElement, getPluginType } from '@udecode/plate';
import type { ExtendEditor } from '@udecode/plate/react';

import { SpoilerPlugin } from './spoiler-plugin';

export const withSpoiler: ExtendEditor = ({ editor }) => {
    editor.api.shouldMergeNodesRemovePrevNode = (
        prevNodeEntry,
        curNodeEntry,
    ) => {
        const prevNode = prevNodeEntry[0] as TElement;

        if (prevNode.type === SpoilerPlugin.key) return false;

        return editor.api.shouldMergeNodesRemovePrevNode(
            prevNodeEntry,
            curNodeEntry,
        );
    };

    editor.tf.normalizeNode = ([node, path]) => {
        if (ElementApi.isElement(node)) {
            if (node.type === getPluginType(editor, SpoilerPlugin)) {
                const { children } = node;

                if (editor.api.isText(children[0])) {
                    editor.tf.wrapNodes(
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

        editor.tf.normalizeNode([node, path]);
    };

    return editor;
};
