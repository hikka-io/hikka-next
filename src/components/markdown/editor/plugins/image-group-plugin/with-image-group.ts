import { ElementApi, getPluginType } from '@udecode/plate';
import type { ExtendEditor } from '@udecode/plate/react';
import { Text } from 'slate';

import { ImageGroupConfig, ImageGroupPlugin } from './image-group-plugin';
import { insertImageGroupFromFiles } from './transforms/insert-images-group-from-files';

export const withImageGroup: ExtendEditor<ImageGroupConfig> = ({
    editor,
    plugin,
}) => {
    editor.tf.normalizeNode = ([node, path]) => {
        if (
            ElementApi.isElement(node) &&
            node.type === getPluginType(editor, ImageGroupPlugin)
        ) {
            const { children } = node;

            if (children.length === 1 && Text.isText(children[0])) {
                editor.tf.removeNodes({ at: path });
                return;
            }
        }

        editor.tf.normalizeNode([node, path]);
    };

    editor.tf.insertData = (data: DataTransfer) => {
        const text = data.getData('text/plain');
        const { files } = data;

        if (!text && files && files.length > 0) {
            insertImageGroupFromFiles(editor, files);
        } else {
            return editor.tf.insertData(data);
        }
    };

    return editor;
};
