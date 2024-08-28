'use client';

import { useParams } from 'next/navigation';
import { ChangeEvent, useRef } from 'react';
import MaterialSymbolsImageOutlineRounded from '~icons/material-symbols/image-outline-rounded';
import MaterialSymbolsPerson2OutlineRounded from '~icons/material-symbols/person-2-outline-rounded';
import MaterialSymbolsUploadRounded from '~icons/material-symbols/upload-rounded';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from '@/components/ui/image';
import { Input } from '@/components/ui/input';

import CropEditorModal from '@/features/modals/crop-editor-modal.component';

import useSession from '@/services/hooks/auth/use-session';
import useUser from '@/services/hooks/user/use-user';
import { useModalContext } from '@/services/providers/modal-provider';

const UserInfo = () => {
    const uploadAvatarRef = useRef<HTMLInputElement>(null);
    const uploadCoverRef = useRef<HTMLInputElement>(null);
    const { openModal } = useModalContext();
    const params = useParams();

    const { data: user } = useUser({ username: String(params.username) });
    const { user: loggedUser } = useSession();

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

    if (!user) {
        return null;
    }

    return (
        <div className="relative">
            <Input
                type="file"
                id="avatar-input"
                onChange={(e) => handleUploadImageSelected(e, 'avatar')}
                ref={uploadAvatarRef}
                multiple={false}
                className="absolute left-0 top-0 size-full opacity-0"
                accept="image/*"
            />
            <Input
                type="file"
                id="cover-input"
                onChange={(e) => handleUploadImageSelected(e, 'cover')}
                ref={uploadCoverRef}
                multiple={false}
                className="absolute left-0 top-0 size-full opacity-0"
                accept="image/*"
            />
            <div className="group relative z-[1] size-32 overflow-hidden rounded-lg pt-[100%] lg:size-48">
                <div className="absolute top-0 w-full rounded-lg">
                    <Image
                        alt="avatar"
                        className="size-full object-contain"
                        width={287}
                        height={287}
                        src={user.avatar}
                    />
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
                <div className="absolute -bottom-2 -right-2 z-[1] size-6 rounded-full border-4 border-secondary bg-success" />
            )}
        </div>
    );
};

export default UserInfo;
