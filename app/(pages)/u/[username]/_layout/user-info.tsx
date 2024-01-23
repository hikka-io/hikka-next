'use client';

import clsx from 'clsx';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import ClarityAdministratorSolid from '~icons/clarity/administrator-solid';
import MaterialSymbolsImageOutlineRounded from '~icons/material-symbols/image-outline-rounded';
import MaterialSymbolsPerson2OutlineRounded from '~icons/material-symbols/person-2-outline-rounded';
import MaterialSymbolsUploadRounded from '~icons/material-symbols/upload-rounded';



import { useParams, usePathname } from 'next/navigation';



import { useQuery, useQueryClient } from '@tanstack/react-query';



import Image from '@/app/_components/image';
import Tooltip from '@/app/_components/tooltip';
import { Button } from '@/app/_components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/_components/ui/dropdown-menu';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import CropEditorModal from '@/app/_layout/crop-editor-modal';
import getUserInfo from '@/utils/api/user/getUserInfo';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useModalContext } from '@/utils/providers/modal-provider';


interface Props {}

const Component = ({}: Props) => {
    // const pathname = usePathname();
    const uploadAvatarRef = useRef<HTMLInputElement>(null);
    const uploadCoverRef = useRef<HTMLInputElement>(null);
    const { switchModal } = useModalContext();
    const queryClient = useQueryClient();
    const params = useParams();
    const { secret } = useAuthContext();
    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File>();
    const [selectedCoverFile, setSelectedCoverFile] = useState<File>();

    const loggedUser: Hikka.User | undefined = queryClient.getQueryData([
        'loggedUser',
        secret,
    ]);

    const { data: user } = useQuery({
        queryKey: ['user', params.username],
        queryFn: () => getUserInfo({ username: String(params.username) }),
        staleTime: 0,
    });

    const handleUploadImageSelected = (e: ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        if (e.target.files && e.target.files.length > 0) {
            const file = Array.from(e.target.files)[0];

            switch (type) {
                case 'avatar':
                    setSelectedAvatarFile(file);
                    switchModal('uploadAvatar');

                    if (uploadAvatarRef.current) {
                        uploadAvatarRef.current.value = '';
                    }
                    return;
                case 'cover':
                    setSelectedCoverFile(file);
                    switchModal('uploadCover');

                    if (uploadCoverRef.current) {
                        uploadCoverRef.current.value = '';
                    }
                    return;
            }
        }
    };

    if (!user) {
        return null;
    }

    if (secret && !loggedUser) {
        return null;
    }

    // useEffect(() => {
    //     if (user && user.cover) {
    //         document.querySelector("body")?.classList.add("no-gradient");
    //     }
    //
    //     if (user && !user.cover) {
    //         document.querySelector("body")?.classList.remove("no-gradient");
    //     }
    // }, [user]);
    //
    // useEffect(() => {
    //     if (!pathname.includes("/u")) {
    //         document.querySelector("body")?.classList.remove("no-gradient");
    //     }
    // }, [pathname])

    return (
        <>
            <div className="grid grid-cols-[auto_1fr] gap-4 lg:grid-cols-1">
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
                    <div className="group relative z-[1] h-32 w-32 overflow-hidden rounded-lg pt-[100%] lg:w-full">
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
                                            <label htmlFor="avatar-input">Оновити аватар</label>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <div>
                                            <MaterialSymbolsImageOutlineRounded className="mr-2" />
                                            <label htmlFor="cover-input">Оновити обкладинку</label>
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        <div className="absolute right-2 top-2">
                            {(user.role === 'admin' ||
                                user.role === 'moderator') && (
                                <Tooltip
                                    placement="left"
                                    className="mr-1 p-1"
                                    data={
                                        <p className="text-sm">
                                            {user.role === 'admin'
                                                ? 'Адміністратор'
                                                : 'Модератор'}
                                        </p>
                                    }
                                >
                                    <div className="rounded-md bg-primary p-1 text-xs font-bold text-primary-foreground">
                                        <ClarityAdministratorSolid />
                                    </div>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                    <div
                        className={clsx(
                            'absolute -bottom-2 left-0 z-0 h-4 w-full rounded-b-lg',
                            user.active ? 'bg-success' : 'bg-neutral',
                        )}
                    />
                </div>
                <div className="flex w-full flex-col lg:text-center">
                    <h3 className="overflow-hidden overflow-ellipsis">
                        {user.username}
                    </h3>
                    {user.description && (
                        <p className="text-sm text-muted-foreground">
                            {user.description}
                        </p>
                    )}
                </div>
            </div>

            <CropEditorModal file={selectedAvatarFile} />
        </>
    );
};

export default Component;