import { getPluginType, isElement, removeNodes } from '@udecode/plate-common';
import type { ExtendEditor } from '@udecode/plate-common/react';
import { Text } from 'slate';

import { ImageGroupConfig, ImageGroupPlugin } from './image-group-plugin';
import { insertImageGroupFromFiles } from './transforms/insert-images-group-from-files';

export const withImageGroup: ExtendEditor<ImageGroupConfig> = ({
    editor,
    plugin,
}) => {
    const { normalizeNode, insertData } = editor;

    editor.normalizeNode = ([node, path]) => {
        if (
            isElement(node) &&
            node.type === getPluginType(editor, ImageGroupPlugin)
        ) {
            const { children } = node;

            if (children.length === 1 && Text.isText(children[0])) {
                removeNodes(editor, { at: path });
                return;
            }
        }

        normalizeNode([node, path]);
    };

    editor.insertData = (data: DataTransfer) => {
        const text = data.getData('text/plain');
        const { files } = data;

        if (!text && files && files.length > 0) {
            insertImageGroupFromFiles(editor, files);
        } else {
            return insertData(data);
        }
    };

    return editor;
};
