'use client';

import clsx from 'clsx';
import { ChangeEvent, useRef } from 'react';
import CilUserFollow from '~icons/cil/user-follow';
import CilUserUnfollow from '~icons/cil/user-unfollow';
import ClarityAdministratorSolid from '~icons/clarity/administrator-solid';
import MaterialSymbolsUploadRounded from '~icons/material-symbols/upload-rounded';

import { useParams } from 'next/navigation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Image from '@/app/_components/Image';
import Tooltip from '@/app/_components/Tooltip';
import checkFollow from '@/utils/api/follow/checkFollow';
import follow from '@/utils/api/follow/follow';
import getFollowStats from '@/utils/api/follow/getFollowStats';
import unfollow from '@/utils/api/follow/unfollow';
import getLoggedUserInfo from '@/utils/api/user/getLoggedUserInfo';
import getUserInfo from '@/utils/api/user/getUserInfo';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useModalContext } from '@/utils/providers/ModalProvider';

interface Props {}

const Component = ({}: Props) => {
    const uploadImageRef = useRef<HTMLInputElement>(null);
    const { switchModal } = useModalContext();
    const queryClient = useQueryClient();
    const params = useParams();
    const { secret } = useAuthContext();

    const { data: followStats } = useQuery({
        queryKey: ['followStats', params.username],
        queryFn: () => getFollowStats({ username: String(params.username) }),
    });

    const { data: user } = useQuery({
        queryKey: ['user', params.username],
        queryFn: () => getUserInfo({ username: String(params.username) }),
    });

    const { data: loggedUser } = useQuery({
        queryKey: ['loggedUser', secret],
        queryFn: () => getLoggedUserInfo({ secret }),
        enabled: Boolean(secret),
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

    const { mutate: mutateFollow, isLoading: followLoading } = useMutation({
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

    const { mutate: mutateUnfollow, isLoading: unfollowLoading } = useMutation({
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

            const chunkSize = 5 * 1024 * 1024; // 5MB
            const totalChunks = Math.ceil(file.size / chunkSize);
            const chunkProgress = 100 / totalChunks;
            let chunkNumber = 0;
            let start = 0;
            let end = 0;

            const uploadNextChunk = async () => {
                if (end <= file.size) {
                    const chunk = file.slice(start, end);
                    const formData = new FormData();
                    formData.append('file', chunk);
                    formData.append('chunkNumber', String(chunkNumber));
                    formData.append('totalChunks', String(totalChunks));
                    formData.append('originalname', file.name);

                    fetch('http://localhost:8000/test/image', {
                        method: 'POST',
                        body: formData,
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            console.log({ data });

                            chunkNumber++;
                            start = end;
                            end = start + chunkSize;
                            uploadNextChunk();
                        })
                        .catch((error) => {
                            console.error('Error uploading chunk:', error);
                        });
                }
            };

            uploadNextChunk();
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
                            <div className="btn-badge btn btn-square btn-secondary absolute bottom-2 right-2 opacity-0 group-hover:opacity-100">
                                <MaterialSymbolsUploadRounded />
                                <input
                                    type="file"
                                    onChange={handleUploadImageSelected}
                                    ref={uploadImageRef}
                                    className="absolute left-0 top-0 h-full w-full opacity-0"
                                    accept="image/png, image/jpeg"
                                />
                            </div>
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
                                    <div className="rounded-md bg-accent p-1 text-xs font-bold text-accent-content">
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
                        <p className="label-text">{user.description}</p>
                    )}
                </div>
            </div>
            <div className="flex h-fit gap-4 rounded-lg border border-secondary/60 bg-secondary/30 p-4">
                <button
                    onClick={() => switchModal('followers')}
                    className="flex flex-1 flex-col gap-1"
                >
                    <p className="label-text !text-base-content">
                        <span className="font-bold">
                            {followStats ? followStats.followers : 0}
                        </span>
                    </p>
                    <p className="label-text">стежать</p>
                </button>
                <button
                    onClick={() => switchModal('followings')}
                    className="flex flex-1 flex-col gap-1"
                >
                    <p className="label-text !text-base-content">
                        <span className="font-bold">
                            {followStats ? followStats.following : 0}
                        </span>
                    </p>
                    <p className="label-text">відстежується</p>
                </button>
            </div>
            {loggedUser ? (
                loggedUser.username !== user.username && followChecker ? (
                    followChecker.follow ? (
                        <button
                            disabled={unfollowLoading}
                            onClick={() => handleFollowAction('unfollow')}
                            className="btn btn-error btn-outline w-full"
                        >
                            {unfollowLoading ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                <CilUserUnfollow />
                            )}
                            Не стежити
                        </button>
                    ) : (
                        <button
                            disabled={followLoading}
                            onClick={() => handleFollowAction('follow')}
                            className="btn btn-secondary w-full"
                        >
                            {followLoading ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                <CilUserFollow />
                            )}
                            Відстежувати
                        </button>
                    )
                ) : null
            ) : (
                <button
                    onClick={() => switchModal('login')}
                    className="btn btn-secondary w-full"
                >
                    <CilUserFollow />
                    Відстежувати
                </button>
            )}
        </div>
    );
};

export default Component;
