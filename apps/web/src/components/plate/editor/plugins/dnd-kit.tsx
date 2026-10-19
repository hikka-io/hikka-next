import { DndPlugin } from '@platejs/dnd';
import { PathApi } from 'platejs';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BlockDraggable } from '@/components/plate/ui/block-draggable';

import { ImageGroupPlugin } from './image-group-plugin';

export const DndKit = [
    DndPlugin.configure({
        options: {
            enableScroller: true,
            // The drag backend takes file drops over blocks, so they upload here instead of through `insertData`.
            onDropFiles: ({ editor, dragItem, target }) => {
                if (target) {
                    const previous = PathApi.previous(target);
                    editor.tf.select(
                        previous
                            ? editor.api.end(previous)
                            : editor.api.start(target),
                    );
                }

                editor
                    .getTransforms(ImageGroupPlugin)
                    .imageGroup.upload({ files: Array.from(dragItem.files) });
            },
        },
        render: {
            aboveNodes: BlockDraggable,
            aboveSlate: ({ children }) => (
                <DndProvider backend={HTML5Backend}>{children}</DndProvider>
            ),
        },
    }),
];
