'use client';

import { cn, withRef } from '@udecode/cn';
import {
    TElement,
    findNodePath,
    insertNodes,
    isText,
} from '@udecode/plate-common';
import { PlateEditor } from '@udecode/plate-common/react';
import { Plus } from 'lucide-react';
import { FC, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ImagePlugin } from '../plugins/image-group-plugin/image-group-plugin';
import { PlateElement } from './plate-element';

interface AddImageButtonProps {
    element: TElement;
    editor: PlateEditor;
}

const AddImageButton: FC<AddImageButtonProps> = ({ element, editor }) => {
    const insertImage = useCallback(
        ({ files }: { files: FileList | null }) => {
            if (!files) return;

            const file = files[0];
            const url = URL.createObjectURL(file);
            const path = findNodePath(editor, element);

            if (!path) return;

            insertNodes(
                editor,
                {
                    type: ImagePlugin.key,
                    url,
                    children: [{ text: '' }],
                },
                { at: [...path, element.children.length] },
            );
        },
        [element, editor],
    );

    return (
        <Button
            variant="secondary"
            className="size-28 text-muted-foreground relative"
        >
            <Input
                type="file"
                id="avatar-input"
                onChange={(e) => insertImage({ files: e.target.files })}
                multiple={false}
                className="absolute left-0 top-0 size-full opacity-0 cursor-pointer"
                accept="image/*"
            />
            <Plus className="!size-8" />
        </Button>
    );
};

export const ImageGroupElement = withRef<typeof PlateElement>(
    ({ children, className, element, editor, ...props }, ref) => {
        const isOnlyText =
            element.children.length === 1 &&
            isText(element.children[0]) &&
            element.children[0].text === '';

        return (
            <PlateElement
                ref={ref}
                as="div"
                className={cn('mb-4 flex gap-3 overflow-x-auto', className)}
                element={element}
                editor={editor}
                {...props}
                contentEditable={false}
            >
                {!isOnlyText && children}
                {children.length < 4 && (
                    <AddImageButton editor={editor} element={element} />
                )}
            </PlateElement>
        );
    },
);
