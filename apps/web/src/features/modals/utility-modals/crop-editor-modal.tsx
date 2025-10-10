'use client';

import { ImageType, UploadTypeEnum } from '@hikka/client';
import { useCreateImageUpload } from '@hikka/react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { toast } from 'sonner';

import MaterialSymbolsZoomInRounded from '@/components/icons/material-symbols/MaterialSymbolsZoomInRounded';
import MaterialSymbolsZoomOutRounded from '@/components/icons/material-symbols/MaterialSymbolsZoomOutRounded';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

import { useModalContext } from '@/services/providers/modal-provider';
import { cn, getImage } from '@/utils/utils';

interface Props {
    file?: File;
    type: ImageType;
}

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

const Component = ({ file, type }: Props) => {
    const { closeModal } = useModalContext();
    const router = useRouter();

    const editor = useRef<AvatarEditor>(null);
    const [scale, setScale] = useState<number>(100);

    const uploadImageMutation = useCreateImageUpload({
        options: {
            onSuccess: () => {
                const successMessage =
                    type === UploadTypeEnum.AVATAR
                        ? 'Ви успішно оновили свій аватар.'
                        : 'Ви успішно оновили свою обкладинку.';

                toast.success(successMessage);
            },
            onError: () => {
                const errorMessage =
                    type === UploadTypeEnum.AVATAR
                        ? 'Щось пішло не так. Перевірте файл та спробуйте завантажити аватар ще раз.'
                        : 'Щось пішло не так. Перевірте файл та спробуйте завантажити обкладинку ще раз.';

                toast.error(errorMessage);
            },
            onSettled: () => {
                router.refresh();
                closeModal();
            },
        },
    });

    const handleImage = async (canvas: HTMLCanvasElement) => {
        const file = await getImage({ canvas });

        uploadImageMutation.mutate({
            uploadType: type,
            file,
        });
    };

    return (
        <>
            <div className="relative grid h-auto w-full place-content-center text-center">
                <AvatarEditor
                    ref={editor}
                    className={cn(
                        '!m-auto !h-auto !w-full',
                        'rounded',
                        uploadImageMutation.isPending && 'pointer-events-none',
                    )}
                    image={file!}
                    {...CROP_PARAMS[type]}
                    color={[0, 0, 0, 0.7]}
                    scale={scale / 100}
                    rotate={0}
                />
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <MaterialSymbolsZoomOutRounded className="text-muted-foreground" />
                    <Slider
                        disabled={uploadImageMutation.isPending}
                        onValueChange={(value) => setScale(value[0] as number)}
                        min={100}
                        max={130}
                        value={[scale]}
                    />
                    <MaterialSymbolsZoomInRounded className="text-muted-foreground" />
                </div>
                <Button
                    variant="secondary"
                    disabled={uploadImageMutation.isPending}
                    onClick={() =>
                        handleImage(editor.current!.getImageScaledToCanvas())
                    }
                >
                    {uploadImageMutation.isPending && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Зберегти
                </Button>
            </div>
        </>
    );
};

export default Component;
