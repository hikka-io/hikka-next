'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { ChangeEvent, useRef } from 'react';

import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import P from '@/components/typography/p';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import Image from '@/components/ui/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import CropEditorModal from '@/features/modals/crop-editor-modal.component';

import deleteUserImage from '@/services/api/settings/deleteUserImage';
import useSession from '@/services/hooks/auth/use-session';
import { useModalContext } from '@/services/providers/modal-provider';

const Appearance = () => {
    const queryClient = useQueryClient();
    const uploadAvatarRef = useRef<HTMLInputElement>(null);
    const uploadCoverRef = useRef<HTMLInputElement>(null);
    const { openModal } = useModalContext();

    const { user: loggedUser } = useSession();

    const mutation = useMutation({
        mutationFn: deleteUserImage,
        onSuccess: (data) => {
            enqueueSnackbar('Медіафайл успішно видалено.', {
                variant: 'success',
            });
            queryClient.invalidateQueries();
        },
    });

    const handleUploadImageSelected = (
        e: ChangeEvent<HTMLInputElement>,
        type: 'avatar' | 'cover',
    ) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = Array.from(e.target.files)[0];

            switch (type) {
                case 'avatar':
                    if (uploadAvatarRef.current) {
                        uploadAvatarRef.current.value = '';
                    }
                    break;
                case 'cover':
                    if (uploadCoverRef.current) {
                        uploadCoverRef.current.value = '';
                    }
                    break;
            }

            openModal({
                content: <CropEditorModal file={file} type={type} />,
                className: '!max-w-lg',
                title: 'Редагувати медіафайл',
            });
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Label>Зображення профілю</Label>
                <P className="text-sm text-muted-foreground">
                    Рекомендований розмір обкладинки 1500x500, аватару 400x400
                </P>
            </div>
            <div className="relative mb-4 flex h-48 w-full cursor-pointer">
                {loggedUser?.cover && (
                    <Button
                        className="absolute right-2 top-2 z-10"
                        variant="destructive"
                        size={'icon-sm'}
                        onClick={() =>
                            mutation.mutate({ params: { image_type: 'cover' } })
                        }
                    >
                        <MaterialSymbolsDeleteForeverRounded className="size-4" />
                    </Button>
                )}
                <Card className="flex-1 overflow-hidden bg-secondary/20 p-0 transition-opacity hover:opacity-60">
                    {loggedUser?.cover ? (
                        <Image
                            alt="cover"
                            height={500}
                            width={300}
                            className="size-full rounded-md object-cover"
                            src={loggedUser?.cover}
                        />
                    ) : (
                        <div className="flex flex-1 items-center justify-center">
                            <P className="text-sm text-muted-foreground">
                                Натисність, щоб завантажити обкладинку
                            </P>
                        </div>
                    )}

                    <Input
                        type="file"
                        id="cover-input"
                        onChange={(e) => handleUploadImageSelected(e, 'cover')}
                        ref={uploadCoverRef}
                        multiple={false}
                        className="absolute left-0 top-0 size-full cursor-pointer opacity-0"
                        accept="image/*"
                    />
                </Card>
                <Avatar className="absolute -bottom-4 left-4 size-32 rounded-md transition-opacity hover:opacity-60">
                    <AvatarImage src={loggedUser?.avatar} />
                    <AvatarFallback className="rounded-md">
                        {loggedUser?.username[0]}
                    </AvatarFallback>
                    <Input
                        type="file"
                        id="avatar-input"
                        onChange={(e) => handleUploadImageSelected(e, 'avatar')}
                        ref={uploadAvatarRef}
                        multiple={false}
                        // eslint-disable-next-line tailwindcss/classnames-order
                        className="absolute left-0 top-0 size-full opacity-0 cursor-pointer"
                        accept="image/*"
                    />
                </Avatar>
            </div>
        </div>
    );
};

export default Appearance;
