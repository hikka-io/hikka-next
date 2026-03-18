'use client';

import { ImageType, UploadTypeEnum } from '@hikka/client';
import { useSession, useUserByUsername } from '@hikka/react';
import { ChangeEvent, useRef, useState } from 'react';

import MaterialSymbolsImageOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsImageOutlineRounded';
import MaterialSymbolsPerson2OutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsPerson2OutlineRounded';
import MaterialSymbolsUploadRounded from '@/components/icons/material-symbols/MaterialSymbolsUploadRounded';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from '@/components/ui/image';
import { Input } from '@/components/ui/input';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';

import { CropEditorModal } from '@/features/common';

import { Link, useParams } from '@/utils/navigation';

const UserInfo = () => {
    const uploadAvatarRef = useRef<HTMLInputElement>(null);
    const uploadCoverRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadType, setUploadType] = useState<ImageType>(UploadTypeEnum.AVATAR);
    const params = useParams();

    const { data: user } = useUserByUsername({
        username: String(params.username),
        options: {
            enabled: !!params.username,
        },
    });
    const { user: loggedUser } = useSession();

    const handleUploadImageSelected = (
        e: ChangeEvent<HTMLInputElement>,
        type: ImageType,
    ) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = Array.from(e.target.files)[0];

            switch (type) {
                case UploadTypeEnum.AVATAR:
                    if (uploadAvatarRef.current) {
                        uploadAvatarRef.current.value = '';
                    }
                    break;
                case UploadTypeEnum.COVER:
                    if (uploadCoverRef.current) {
                        uploadCoverRef.current.value = '';
                    }
                    break;
            }

            setUploadFile(file);
            setUploadType(type);
            setOpen(true);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="relative h-fit">
            <Input
                type="file"
                id="avatar-input"
                onChange={(e) =>
                    handleUploadImageSelected(e, UploadTypeEnum.AVATAR)
                }
                ref={uploadAvatarRef}
                multiple={false}
                className="absolute left-0 top-0 size-full opacity-0"
                accept="image/*"
            />
            <Input
                type="file"
                id="cover-input"
                onChange={(e) =>
                    handleUploadImageSelected(e, UploadTypeEnum.COVER)
                }
                ref={uploadCoverRef}
                multiple={false}
                className="absolute left-0 top-0 size-full opacity-0"
                accept="image/*"
            />
            <div className="group relative z-1 size-32 overflow-hidden rounded-lg pt-[100%] lg:size-40">
                <div className="absolute top-0 w-full rounded-lg">
                    <Link to={`/u/${user.username}`}>
                        <Image
                            alt="avatar"
                            className="size-full object-contain hover:underline"
                            width={287}
                            height={287}
                            src={user.avatar}
                        />
                    </Link>
                </div>
                {loggedUser?.username === user.username && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="icon-sm"
                                variant="secondary"
                                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100"
                            >
                                <MaterialSymbolsUploadRounded />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem asChild>
                                <div>
                                    <MaterialSymbolsPerson2OutlineRounded className="mr-2" />
                                    <label htmlFor="avatar-input">
                                        Оновити аватар
                                    </label>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <div>
                                    <MaterialSymbolsImageOutlineRounded className="mr-2" />
                                    <label htmlFor="cover-input">
                                        Оновити обкладинку
                                    </label>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
            {user.active && (
                <div className="border-success bg-success-foreground absolute -bottom-2 -right-2 z-1 size-6 rounded-full border-4" />
            )}
            <ResponsiveModal open={open} onOpenChange={setOpen} forceDesktop>
                <ResponsiveModalContent className="!max-w-lg" title="Редагувати медіафайл">
                    {uploadFile && (
                        <CropEditorModal
                            file={uploadFile}
                            type={uploadType}
                            onClose={() => setOpen(false)}
                        />
                    )}
                </ResponsiveModalContent>
            </ResponsiveModal>
        </div>
    );
};

export default UserInfo;
