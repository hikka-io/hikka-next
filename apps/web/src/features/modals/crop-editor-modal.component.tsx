'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

import uploadImage from '@/services/api/upload/uploadImage';
import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

import MaterialSymbolsZoomInRounded from '../../components/icons/material-symbols/MaterialSymbolsZoomInRounded';
import MaterialSymbolsZoomOutRounded from '../../components/icons/material-symbols/MaterialSymbolsZoomOutRounded';

interface Props {
    file?: File;
    type: 'cover' | 'avatar';
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
    const queryClient = useQueryClient();
    const params = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);
    const editor = useRef<AvatarEditor>(null);
    const [scale, setScale] = useState<number>(100);

    const uploadFile = async (file: File) => {
        if (type === 'avatar') {
            try {
                const res = await uploadImage({
                    params: {
                        file,
                        upload_type: 'avatar',
                    },
                });

                enqueueSnackbar('Ви успішно оновили свій аватар.', {
                    variant: 'success',
                });

                return res;
            } catch (e) {
                enqueueSnackbar(
                    'Щось пішло не так. Перевірте файл та спробуйте завантажити аватар ще раз.',
                    { variant: 'error' },
                );

                throw e;
            }
        }

        if (type === 'cover') {
            try {
                const res = await uploadImage({
                    params: {
                        file,
                        upload_type: 'cover',
                    },
                });

                enqueueSnackbar('Ви успішно оновили свою обкладинку.', {
                    variant: 'success',
                });

                return res;
            } catch (e) {
                enqueueSnackbar(
                    'Щось пішло не так. Перевірте файл та спробуйте завантажити обкладинку ще раз.',
                    { variant: 'error' },
                );

                throw e;
            }
        }
    };

    const getBlob = async (
        canvas: HTMLCanvasElement,
        quality = 0.85,
        type = 'image/jpeg',
    ) => {
        const dataUrl = canvas.toDataURL(type, quality);
        const res = await fetch(dataUrl);

        return await res.blob();
    };

    const blobToFile = (theBlob: Blob, fileName: string) => {
        const b: any = theBlob;
        b.lastModifiedDate = new Date();
        b.name = fileName;

        return theBlob as File;
    };

    const getImage = async (canvas: HTMLCanvasElement) => {
        try {
            setIsLoading(true);
            let blob = await getBlob(canvas);

            if (blob.size > 100000) {
                blob = await getBlob(canvas, 0.7);
            }

            const file = blobToFile(blob, 'avatar.jpg');

            await uploadFile(file);

            await queryClient.invalidateQueries({
                queryKey: ['logged-user'],
            });
            await queryClient.invalidateQueries({
                queryKey: ['user', params.username],
            });

            router.refresh();

            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
        }

        closeModal();
    };

    // boxClassName="!max-w-lg"
    // title="Редагувати медіафайл"

    return (
        <>
            <div className="relative grid h-auto w-full place-content-center text-center">
                <AvatarEditor
                    ref={editor}
                    className={cn(
                        '!w-full !h-auto !m-auto',
                        'rounded',
                        isLoading && 'pointer-events-none',
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
                        disabled={isLoading}
                        onValueChange={(value) => setScale(value[0] as number)}
                        min={100}
                        max={130}
                        value={[scale]}
                    />
                    <MaterialSymbolsZoomInRounded className="text-muted-foreground" />
                </div>
                <Button
                    variant="secondary"
                    disabled={isLoading}
                    onClick={() =>
                        getImage(editor.current!.getImageScaledToCanvas())
                    }
                >
                    {isLoading && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Зберегти
                </Button>
            </div>
        </>
    );
};

export default Component;
