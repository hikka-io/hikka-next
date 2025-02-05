import {
    getPluginType,
    isElement,
    removeNodes
} from '@udecode/plate-common';
import type { ExtendEditor } from '@udecode/plate-common/react';
import { Text } from 'slate';
import { ImageGroupPlugin } from './image-group-plugin';

export const withImageGroup: ExtendEditor = ({ editor }) => {
    const { normalizeNode } = editor;

    editor.normalizeNode = ([node, path]) => {
        if (isElement(node) && node.type === getPluginType(editor, ImageGroupPlugin)) {
            const { children } = node;

            if (
            children.length === 1 &&
            Text.isText(children[0])
            ) {
            removeNodes(editor, { at: path });
            return; 
            }
        }
    
        normalizeNode([node, path]);
        };
    
        return editor;
};