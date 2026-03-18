'use client';

import { UploadTypeEnum } from '@hikka/client';
import { useDeleteImage, useSession } from '@hikka/react';
import { ChangeEvent, useRef, useState } from 'react';

import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import Image from '@/components/ui/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';

import { CropEditorModal } from '@/features/common';

const Appearance = () => {
    const uploadAvatarRef = useRef<HTMLInputElement>(null);
    const uploadCoverRef = useRef<HTMLInputElement>(null);
    const [cropOpen, setCropOpen] = useState(false);
    const [cropFile, setCropFile] = useState<File | null>(null);
    const [cropType, setCropType] = useState<
        UploadTypeEnum.AVATAR | UploadTypeEnum.COVER
    >(UploadTypeEnum.AVATAR);

    const { user: loggedUser } = useSession();

    const { mutate: deleteImage, isPending: isDeletingImage } =
        useDeleteImage();

    const handleUploadImageSelected = (
        e: ChangeEvent<HTMLInputElement>,
        type: UploadTypeEnum.AVATAR | UploadTypeEnum.COVER,
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

            setCropFile(file);
            setCropType(type);
            setCropOpen(true);
        }
    };

    return (
        <>
        <div className="isolate flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Label>Зображення профілю</Label>
                <p className="text-sm text-muted-foreground">
                    Рекомендований розмір обкладинки 1500x500, аватару 400x400
                </p>
            </div>
            <div className="relative mb-4 flex h-48 w-full cursor-pointer">
                {loggedUser?.cover && (
                    <Button
                        className="absolute right-2 top-2 z-10"
                        variant="destructive"
                        size={'icon-sm'}
                        onClick={() =>
                            deleteImage({ imageType: UploadTypeEnum.COVER })
                        }
                        disabled={isDeletingImage}
                    >
                        {isDeletingImage ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <MaterialSymbolsDeleteForeverRounded className="size-4" />
                        )}
                    </Button>
                )}
                <Card className="flex-1 overflow-hidden bg-secondary/20 p-0 transition-opacity hover:opacity-60">
                    {loggedUser?.cover ? (
                        <Image
                            alt="cover"
                            className="size-full rounded-md object-cover"
                            src={loggedUser?.cover}
                        />
                    ) : (
                        <div className="flex flex-1 items-center justify-center">
                            <p className="text-sm text-muted-foreground">
                                Натисність, щоб завантажити обкладинку
                            </p>
                        </div>
                    )}

                    <Input
                        type="file"
                        id="cover-input"
                        onChange={(e) =>
                            handleUploadImageSelected(e, UploadTypeEnum.COVER)
                        }
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
                        onChange={(e) =>
                            handleUploadImageSelected(e, UploadTypeEnum.AVATAR)
                        }
                        ref={uploadAvatarRef}
                        multiple={false}
                        // eslint-disable-next-line tailwindcss/classnames-order
                        className="absolute left-0 top-0 size-full opacity-0 cursor-pointer"
                        accept="image/*"
                    />
                </Avatar>
            </div>
        </div>
        <ResponsiveModal open={cropOpen} onOpenChange={setCropOpen} forceDesktop>
            <ResponsiveModalContent className="!max-w-lg" title="Редагувати медіафайл">
                {cropFile && (
                    <CropEditorModal
                        file={cropFile}
                        type={cropType}
                        onClose={() => setCropOpen(false)}
                    />
                )}
            </ResponsiveModalContent>
        </ResponsiveModal>
        </>
    );
};

export default Appearance;
