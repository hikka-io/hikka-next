'use client';

import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import MaterialSymbolsZoomInRounded from '~icons/material-symbols/zoom-in-rounded';
import MaterialSymbolsZoomOut from '~icons/material-symbols/zoom-out'

import { useParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import Modal from '@/app/_components/modal';
import { Slider } from '@/app/_components/ui/slider';
import uploadAvatar from '@/utils/api/upload/uploadAvatar';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useModalContext } from '@/utils/providers/modal-provider';
import { Button } from '@/app/_components/ui/button';

interface Props {
    file?: File;
}

const Component = ({ file }: Props) => {
    const queryClient = useQueryClient();
    const params = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);
    const { secret } = useAuthContext();
    const editor = useRef<AvatarEditor>(null);
    const [scale, setScale] = useState<number>(100);
    const { uploadAvatar: uploadAvatarModal, closeModals, switchModal } = useModalContext();

    const onDismiss = (open: boolean) => {
        closeModals();
        switchModal("uploadAvatar", open);
        setScale(100);
    };

    const uploadImage = async (file: File) => {
        if (uploadAvatarModal) {
            try {
                const res = await uploadAvatar({
                    file,
                    secret: String(secret),
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

            await uploadImage(file);

            await queryClient.invalidateQueries({
                queryKey: ['loggedUser']
            });
            await queryClient.invalidateQueries({
                queryKey: ['user', params.username]
            });

            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
        }

        onDismiss(false);
    };

    return (
        <Modal
            open={Boolean(file) && Boolean(uploadAvatarModal)}
            onOpenChange={onDismiss}
            id="searchModal"
            boxClassName="!max-w-lg"
            title="Аватар"
        >
            <div className="relative w-full  h-auto grid text-center place-content-center">
                <AvatarEditor
                    ref={editor}
                    className={clsx(
                        '!w-full !h-auto !m-auto',
                        'rounded',
                        isLoading && 'pointer-events-none',
                    )}
                    image={file!}
                    width={400}
                    height={400}
                    border={50}
                    color={[231, 121, 193, 0.3]} // RGBA
                    scale={scale / 100}
                    rotate={0}
                />
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <MaterialSymbolsZoomOut className="text-muted-foreground"  />
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
        </Modal>
    );
};

export default Component;