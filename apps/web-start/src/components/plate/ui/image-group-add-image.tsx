'use client';

import { Plus } from 'lucide-react';
import type { PlateEditor } from 'platejs/react';
import {
    FC,
    ReactElement,
    cloneElement,
    isValidElement,
    useCallback,
    useId,
} from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
    ImageGroupPlugin,
    type TImageGroupElement,
} from '../editor/plugins/image-group-kit';

interface ImageGroupAddImageProps {
    element?: TImageGroupElement;
    editor: PlateEditor;
    children?: ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
}

export const ImageGroupAddImage: FC<ImageGroupAddImageProps> = ({
    element,
    editor,
    children,
}) => {
    const inputId = useId();

    const insertImage = useCallback(
        (files: FileList | null) => {
            if (!files || files.length === 0) return;
            editor.getTransforms(ImageGroupPlugin).imageGroup.upload({
                files: Array.from(files),
                group: element,
            });
        },
        [editor, element],
    );

    if (isValidElement(children)) {
        return cloneElement(
            children as ReactElement<
                React.InputHTMLAttributes<HTMLInputElement>
            >,
            {
                onChange: (e) =>
                    insertImage((e.target as HTMLInputElement).files),
            },
        );
    }

    return (
        <Button
            variant="secondary"
            className="text-muted-foreground relative size-28"
        >
            <Input
                type="file"
                id={inputId}
                onChange={(e) => insertImage(e.target.files)}
                multiple={false}
                className="absolute top-0 left-0 size-full cursor-pointer opacity-0"
                accept="image/*"
            />
            <Plus className="size-8!" />
        </Button>
    );
};
