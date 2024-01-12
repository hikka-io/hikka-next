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

import Modal from '@/app/_components/Modal';
import Slider from '@/app/_components/Slider';
import uploadAvatar from '@/utils/api/upload/uploadAvatar';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useModalContext } from '@/utils/providers/ModalProvider';

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
    const { uploadAvatar: uploadAvatarModal, closeModals } = useModalContext();

    const onDismiss = () => {
        closeModals();
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

            await queryClient.invalidateQueries(['loggedUser']);
            await queryClient.invalidateQueries(['user', params.username]);

            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
        }

        onDismiss();
    };

    if (!file || !uploadAvatarModal) {
        return null;
    }

    return (
        <Modal
            open={Boolean(uploadAvatarModal)}
            onDismiss={onDismiss}
            id="searchModal"
            boxClassName="!max-w-lg p-0"
            title="Аватар"
        >
            <div className="relative w-full mt-2 h-auto grid text-center place-content-center">
                <AvatarEditor
                    ref={editor}
                    className={clsx(
                        '!w-full !h-auto !m-auto',
                        isLoading && 'pointer-events-none',
                    )}
                    image={file}
                    width={400}
                    height={400}
                    border={50}
                    color={[231, 121, 193, 0.3]} // RGBA
                    scale={scale / 100}
                    rotate={0}
                />
            </div>
            <div className="py-4 px-8 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <MaterialSymbolsZoomOut className="opacity-60" />
                    <Slider
                        disabled={isLoading}
                        onChange={(_e, value) => setScale(value as number)}
                        min={100}
                        max={130}
                        value={scale}
                    />
                    <MaterialSymbolsZoomInRounded className="opacity-60" />
                </div>
                <button
                    disabled={isLoading}
                    className="btn btn-secondary"
                    onClick={() =>
                        getImage(editor.current!.getImageScaledToCanvas())
                    }
                >
                    {isLoading && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Зберегти
                </button>
            </div>
        </Modal>
    );
};

export default Component;