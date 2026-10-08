import { type FC, useRef, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import AvatarEditor from 'react-avatar-editor';
import { toast } from 'sonner';

import {
    UploadTypeEnum,
    uploadImageMutation as uploadImageMutation_,
} from '@hikka/api';

import MaterialSymbolsZoomInRounded from '@/components/icons/material-symbols/MaterialSymbolsZoomInRounded';
import MaterialSymbolsZoomOutRounded from '@/components/icons/material-symbols/MaterialSymbolsZoomOutRounded';
import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';
import { Slider } from '@/components/ui/slider';
import Spinner from '@/components/ui/spinner';
import { useSession } from '@/services/session';
import { apiErrorMessage } from '@/utils/api/api-error-message';
import {
    invalidateSession,
    invalidateUserProfile,
} from '@/utils/api/invalidate-content-state';
import { MUTATION_META_SKIP_ERROR_TOAST } from '@/utils/api/mutation-meta';
import { cn } from '@/utils/cn';
import { getImage } from '@/utils/image';

type BodyProps = {
    file: File;
    type: UploadTypeEnum;
    onClose: () => void;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    file: File | null;
    type: UploadTypeEnum;
};

const CROP_PARAMS = {
    cover: {
        width: 1500,
        height: 500,
        border: [50, 300],
    },
    avatar: {
        width: 400,
        height: 400,
        border: 50,
    },
};

const CropEditorModalBody: FC<BodyProps> = ({ file, type, onClose }) => {
    const queryClient = useQueryClient();
    const { user: loggedUser } = useSession();

    const editor = useRef<AvatarEditor>(null);
    const [scale, setScale] = useState<number>(100);

    const uploadImageMutation = useMutation({
        ...uploadImageMutation_(),
        meta: MUTATION_META_SKIP_ERROR_TOAST,
        onSuccess: () => {
            const successMessage =
                type === UploadTypeEnum.AVATAR
                    ? 'Ви успішно оновили свій аватар.'
                    : 'Ви успішно оновили свою обкладинку.';

            toast.success(successMessage);
        },
        onError: (error) => {
            toast.error(
                apiErrorMessage(
                    error,
                    'Не вдалося завантажити зображення. Спробуйте ще раз.',
                ),
            );
        },
        onSettled: () => {
            invalidateSession(queryClient);
            if (loggedUser) {
                invalidateUserProfile(queryClient, loggedUser.username);
            }
            onClose();
        },
    });

    const handleImage = async (canvas: HTMLCanvasElement) => {
        const file = await getImage({ canvas });

        uploadImageMutation.mutate({
            path: { upload_type: type },
            body: { file },
        });
    };

    return (
        <>
            {/* Centred with auto margins, not justify-center, which puts
                overflow out of reach once the crop area is taller than the box. */}
            <div className="-m-4 flex flex-1 flex-col overflow-y-auto p-4">
                <div className="my-auto flex w-full flex-col gap-4">
                    <div className="relative grid h-auto w-full place-content-center text-center">
                        <AvatarEditor
                            ref={editor}
                            className={cn(
                                'm-auto! h-auto! w-full!',
                                'rounded',
                                uploadImageMutation.isPending &&
                                    'pointer-events-none',
                            )}
                            image={file}
                            {...CROP_PARAMS[type as 'avatar' | 'cover']}
                            color={[0, 0, 0, 0.7]}
                            scale={scale / 100}
                            rotate={0}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <MaterialSymbolsZoomOutRounded className="text-muted-foreground" />
                        <Slider
                            disabled={uploadImageMutation.isPending}
                            onValueChange={(value) =>
                                setScale(value[0] as number)
                            }
                            min={100}
                            max={130}
                            value={[scale]}
                        />
                        <MaterialSymbolsZoomInRounded className="text-muted-foreground" />
                    </div>
                </div>
            </div>
            <ResponsiveModalFooter>
                <Button
                    size="md"
                    disabled={uploadImageMutation.isPending}
                    onClick={() =>
                        handleImage(editor.current!.getImageScaledToCanvas())
                    }
                >
                    {uploadImageMutation.isPending && <Spinner />}
                    Зберегти
                </Button>
            </ResponsiveModalFooter>
        </>
    );
};

const CropEditorModal: FC<Props> = ({ open, onOpenChange, file, type }) => (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} mobile="page">
        <ResponsiveModalContent
            className="md:max-w-lg!"
            title="Редагувати медіафайл"
        >
            {file && (
                <CropEditorModalBody
                    file={file}
                    type={type}
                    onClose={() => onOpenChange(false)}
                />
            )}
        </ResponsiveModalContent>
    </ResponsiveModal>
);

export default CropEditorModal;
