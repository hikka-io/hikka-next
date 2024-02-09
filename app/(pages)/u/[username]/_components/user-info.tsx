'use client';

import { ChangeEvent, useRef, useState } from 'react';
import MaterialSymbolsImageOutlineRounded from '~icons/material-symbols/image-outline-rounded';
import MaterialSymbolsPerson2OutlineRounded from '~icons/material-symbols/person-2-outline-rounded';
import MaterialSymbolsUploadRounded from '~icons/material-symbols/upload-rounded';

import { useParams } from 'next/navigation';

import { useUser } from '@/app/(pages)/u/[username]/page.hooks';
import CropEditorModal from '@/components/modals/crop-editor-modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from '@/components/ui/image';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/services/providers/auth-provider';
import { useModalContext } from '@/services/providers/modal-provider';
import { useLoggedUser } from '@/app/page.hooks';

interface Props {}

const Component = ({}: Props) => {
    // const pathname = usePathname();
    const uploadAvatarRef = useRef<HTMLInputElement>(null);
    const uploadCoverRef = useRef<HTMLInputElement>(null);
    const { openModal } = useModalContext();
    const params = useParams();
    const { secret } = useAuthContext();
    const [selectedFile, setSelectedFile] = useState<File>();

    const { data: user } = useUser(String(params.username));
    const { data: loggedUser } = useLoggedUser(String(secret));

    const handleUploadImageSelected = (
        e: ChangeEvent<HTMLInputElement>,
        type: 'avatar' | 'cover',
    ) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = Array.from(e.target.files)[0];
            setSelectedFile(file);

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
                content: <CropEditorModal file={selectedFile} type={type} />,
                className: '!max-w-lg',
                title: 'Редагувати медіафайл',
            });
        }
    };

    if (!user) {
        return null;
    }

    if (secret && !loggedUser) {
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
                className="absolute left-0 top-0 h-full w-full opacity-0"
                accept="image/png, image/jpeg"
            />
            <Input
                type="file"
                id="cover-input"
                onChange={(e) => handleUploadImageSelected(e, 'cover')}
                ref={uploadCoverRef}
                multiple={false}
                className="absolute left-0 top-0 h-full w-full opacity-0"
                accept="image/png, image/jpeg"
            />
            <div className="group relative z-[1] h-32 w-32 overflow-hidden rounded-lg pt-[100%] lg:h-48 lg:w-48">
                <div className="absolute top-0 w-full rounded-lg">
                    <Image
                        alt="avatar"
                        className="h-full w-full object-contain"
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
        </div>
    );
};

export default Component;