'use client';

import { UploadTypeEnum } from '@hikka/client';
import { useMutation } from '@hikka/react';
import { Plus } from 'lucide-react';
import type { PlateEditor } from 'platejs/react';
import {
    FC,
    ReactElement,
    cloneElement,
    isValidElement,
    useCallback,
} from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { convertPngToJpeg } from '@/utils/utils';

import { ImageGroupPlugin } from '../editor/plugins/image-group-kit';

interface ImageGroupAddImageProps {
    element?: any;
    editor: PlateEditor;
    children?: ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
}

export const ImageGroupAddImage: FC<ImageGroupAddImageProps> = ({
    element,
    editor,
    children,
}) => {
    const { mutate: uploadImages, isPending } = useMutation({
        mutationFn: (client, files: FileList) =>
            editor.getTransforms(ImageGroupPlugin).insert.imageGroupFromFiles({
                files,
                element,
                uploadImage: (file) => {
                    if (file.type.includes('png')) {
                        return convertPngToJpeg({
                            file,
                            outputFormat: 'blob',
                        }).then((result) => {
                            return client.upload.createImageUpload(
                                UploadTypeEnum.ATTACHMENT,
                                result.blob!,
                            );
                        });
                    }

                    return client.upload.createImageUpload(
                        UploadTypeEnum.ATTACHMENT,
                        file,
                    );
                },
            }),
    });

    const insertImage = useCallback(
        ({ files }: { files: FileList | null }) => {
            if (!files) return;

            uploadImages(files);
        },
        [uploadImages],
    );

    if (isValidElement(children)) {
        return cloneElement(
            children as ReactElement<
                React.InputHTMLAttributes<HTMLInputElement>
            >,
            {
                onChange: (e) => insertImage({ files: e.target.files }),
            },
        );
    }

    return (
        <Button
            disabled={isPending}
            variant="secondary"
            className="text-muted-foreground relative size-28"
        >
            <Input
                type="file"
                id="image-group-input"
                onChange={(e) => insertImage({ files: e.target.files })}
                multiple={false}
                className="absolute left-0 top-0 size-full cursor-pointer opacity-0"
                accept="image/*"
            />
            {isPending && <span className="loading loading-spinner"></span>}
            {!isPending && <Plus className="!size-8" />}
        </Button>
    );
};
