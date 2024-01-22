'use client';

import clsx from 'clsx';
import { ChangeEvent, useRef, useState } from 'react';
import CilUserFollow from '~icons/cil/user-follow';
import CilUserUnfollow from '~icons/cil/user-unfollow';
import ClarityAdministratorSolid from '~icons/clarity/administrator-solid';
import MaterialSymbolsUploadRounded from '~icons/material-symbols/upload-rounded';

import { useParams } from 'next/navigation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Image from '@/app/_components/image';
import Tooltip from '@/app/_components/tooltip';
import checkFollow from '@/utils/api/follow/checkFollow';
import follow from '@/utils/api/follow/follow';
import getFollowStats from '@/utils/api/follow/getFollowStats';
import unfollow from '@/utils/api/follow/unfollow';
import getLoggedUserInfo from '@/utils/api/user/getLoggedUserInfo';
import getUserInfo from '@/utils/api/user/getUserInfo';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useModalContext } from '@/utils/providers/modal-provider';
import CropEditorModal from '@/app/_layout/crop-editor-modal';
import { Button } from '@/app/_components/ui/button';
import { Label } from '@/app/_components/ui/label';

interface Props {}

const Component = ({}: Props) => {
    const uploadImageRef = useRef<HTMLInputElement>(null);
    const { switchModal } = useModalContext();
    const queryClient = useQueryClient();
    const params = useParams();
    const { secret } = useAuthContext();
    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File>();

    const loggedUser: Hikka.User | undefined = queryClient.getQueryData([
        'loggedUser',
        secret,
    ]);

    const { data: followStats } = useQuery({
        queryKey: ['followStats', params.username],
        queryFn: () => getFollowStats({ username: String(params.username) }),
    });

    const { data: user } = useQuery({
        queryKey: ['user', params.username],
        queryFn: () => getUserInfo({ username: String(params.username) }),
        staleTime: 0
    });

    const { data: followChecker } = useQuery({
        queryKey: ['followChecker', secret, params.username],
        queryFn: () =>
            checkFollow({
                secret: String(secret),
                username: String(params.username),
            }),
        enabled: loggedUser && loggedUser.username !== params.username,
    });

    const { mutate: mutateFollow, isPending: followLoading } = useMutation({
        mutationKey: ['follow', secret, params.username],
        mutationFn: () =>
            follow({
                secret: String(secret),
                username: String(params.username),
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });

    const { mutate: mutateUnfollow, isPending: unfollowLoading } = useMutation({
        mutationKey: ['unfollow', secret, params.username],
        mutationFn: () =>
            unfollow({
                secret: String(secret),
                username: String(params.username),
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });

    const handleFollowAction = async (action: 'follow' | 'unfollow') => {
        switch (action) {
            case 'follow':
                mutateFollow();
                break;
            case 'unfollow':
                mutateUnfollow();
        }
    };

    const handleUploadImageSelected = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = Array.from(e.target.files)[0];

            setSelectedAvatarFile(file);
            switchModal('uploadAvatar');

            if (uploadImageRef.current) {
                uploadImageRef.current.value = "";
            }
        }
    };

    if (!user) {
        return null;
    }

    if (secret && !loggedUser) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[auto_1fr] gap-4 lg:grid-cols-1">
                <div className="relative">
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
                            <Button size="icon-sm" variant="secondary" className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100">
                                <MaterialSymbolsUploadRounded />
                                <input
                                    type="file"
                                    onChange={handleUploadImageSelected}
                                    ref={uploadImageRef}
                                    multiple={false}
                                    className="absolute left-0 top-0 h-full w-full opacity-0"
                                    accept="image/png, image/jpeg"
                                />
                            </Button>
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
                        <p className="text-sm text-muted-foreground">{user.description}</p>
                    )}
                </div>
            </div>
            <div className="flex h-fit gap-2 rounded-lg border border-secondary/60 bg-secondary/30 p-2">
                <Button
                    onClick={() => switchModal('followers')}
                    className="flex flex-1 flex-col items-center justify-center gap-2 p-2"
                    variant="ghost"
                >
                    <Label>
                        <span className="font-bold">
                            {followStats ? followStats.followers : 0}
                        </span>
                    </Label>
                    <Label className="text-muted-foreground">стежать</Label>
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => switchModal('followings')}
                    className="flex flex-1 flex-col items-center justify-center gap-2 p-2"
                >
                    <Label>
                        <span className="font-bold">
                            {followStats ? followStats.following : 0}
                        </span>
                    </Label>
                    <Label className="text-muted-foreground">відстежується</Label>
                </Button>
            </div>
            {loggedUser ? (
                loggedUser.username !== user.username && followChecker ? (
                    followChecker.follow ? (
                        <Button
                            disabled={unfollowLoading}
                            onClick={() => handleFollowAction('unfollow')}
                            variant="outline"
                            className="w-full"
                        >
                            {unfollowLoading ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                <CilUserUnfollow />
                            )}
                            Не стежити
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            disabled={followLoading}
                            onClick={() => handleFollowAction('follow')}
                            className="btn w-full"
                        >
                            {followLoading ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                <CilUserFollow />
                            )}
                            Відстежувати
                        </Button>
                    )
                ) : null
            ) : (
                <Button //btn-secondary
                    onClick={() => switchModal('login')}
                    className="w-full"
                >
                    <CilUserFollow />
                    Відстежувати
                </Button>
            )}
            <CropEditorModal file={selectedAvatarFile} />
        </div>
    );
};

export default Component;
