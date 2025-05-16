import { UploadTypeEnum } from '@hikka/client';
import { useMutation } from '@hikka/react';
import { TElement } from '@udecode/plate';
import { PlateEditor } from '@udecode/plate/react';
import { Plus } from 'lucide-react';
import {
    FC,
    ReactElement,
    cloneElement,
    isValidElement,
    useCallback,
} from 'react';

import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { insertImageGroupFromFiles } from '../plugins/image-group-plugin/transforms/insert-images-group-from-files';

interface ImageGroupAddImageProps {
    element?: TElement;
    editor: PlateEditor;
    children?: ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
}

const ImageGroupAddImage: FC<ImageGroupAddImageProps> = ({
    element,
    editor,
    children,
}) => {
    const { mutate: uploadImages, isPending } = useMutation({
        mutationFn: (client, files: FileList) =>
            insertImageGroupFromFiles({
                editor,
                files,
                element,
                uploadImage: (file) =>
                    client.upload.createImageUpload(
                        UploadTypeEnum.ATTACHMENT,
                        file,
                    ),
            }),
    });

    const insertImage = useCallback(({ files }: { files: FileList | null }) => {
        if (!files) return;

        uploadImages(files);
    }, []);

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
            className="relative size-28 text-muted-foreground"
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

export default ImageGroupAddImage;
