import {
    cloneElement,
    type FC,
    isValidElement,
    type ReactElement,
    useId,
} from 'react';

import { Plus } from 'lucide-react';
import type { PlateEditor } from 'platejs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';

import type { TImageGroupElement } from '../editor/plate-types';
import { ImageGroupPlugin } from '../editor/plugins/image-group-plugin';
import { restoreSelection } from '../editor/transforms';

type ImageGroupAddImageProps = {
    element?: TImageGroupElement;
    editor: PlateEditor;
    children?: ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
    className?: string;
};

const uploadImages = (
    editor: PlateEditor,
    files: FileList | null,
    group?: TImageGroupElement,
) => {
    if (!files || files.length === 0) return;
    if (!group) restoreSelection(editor);
    editor.getTransforms(ImageGroupPlugin).imageGroup.upload({
        files: Array.from(files),
        group,
    });
};

export function openImagePicker(editor: PlateEditor) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = () => uploadImages(editor, input.files);
    input.click();
}

export const ImageGroupAddImage: FC<ImageGroupAddImageProps> = ({
    element,
    editor,
    children,
    className,
}) => {
    const inputId = useId();

    // Cleared after reading, or picking the same file again fires no `change`.
    const insertImage = (input: HTMLInputElement) => {
        uploadImages(editor, input.files, element);
        input.value = '';
    };

    if (isValidElement(children)) {
        return cloneElement(
            children as ReactElement<
                React.InputHTMLAttributes<HTMLInputElement>
            >,
            {
                onChange: (e) => insertImage(e.target as HTMLInputElement),
            },
        );
    }

    return (
        <Button
            variant="secondary"
            size="sm"
            className={cn('relative', className)}
        >
            <Input
                type="file"
                id={inputId}
                onChange={(e) => insertImage(e.target)}
                multiple
                className="absolute top-0 left-0 size-full cursor-pointer opacity-0"
                accept="image/*"
            />
            <Plus />
            Додати
        </Button>
    );
};
