'use client';

import Image from '@/app/_components/Image';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import getUserInfo from '@/utils/api/user/getUserInfo';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import getLoggedUserInfo from '@/utils/api/user/getLoggedUserInfo';
import CilUserFollow from '~icons/cil/user-follow';
import CilUserUnfollow from '~icons/cil/user-unfollow';
import checkFollow from '@/utils/api/follow/checkFollow';
import follow from '@/utils/api/follow/follow';
import unfollow from '@/utils/api/follow/unfollow';
import { useModalContext } from '@/utils/providers/ModalProvider';
import MaterialSymbolsUploadRounded from '~icons/material-symbols/upload-rounded';
import { ChangeEvent, useRef } from 'react';
import getFollowStats from '@/utils/api/follow/getFollowStats';
import clsx from "clsx";

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
            <div className="grid lg:grid-cols-1 grid-cols-[auto_1fr] gap-4">
                <div className="relative">
                    <div className="rounded-lg z-[1] overflow-hidden w-32 h-32 lg:w-full pt-[100%] relative group">
                        <div className="w-full rounded-lg absolute top-0">
                            <Image
                                alt="avatar"
                                className="object-contain w-full h-full"
                                width={287}
                                height={287}
                                src={user.avatar}
                            />
                        </div>
                        {loggedUser?.username === user.username && (
                            <div className="btn btn-badge btn-square btn-secondary absolute bottom-2 right-2 group-hover:opacity-100 opacity-0">
                                <MaterialSymbolsUploadRounded />
                                <input
                                    type="file"
                                    onChange={handleUploadImageSelected}
                                    ref={uploadImageRef}
                                    className="absolute w-full h-full top-0 left-0 opacity-0"
                                    accept="image/png, image/jpeg"
                                />
                            </div>
                        )}
                        <div className="absolute top-2 right-2">
                            {(user.role === 'admin' ||
                                user.role === 'moderator') && (
                                <div className="w-fit mb-2 text-xs font-bold rounded-md bg-accent text-accent-content px-2 py-1">
                                    {user.role === 'admin'
                                        ? 'Адміністратор'
                                        : 'Модератор'}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={clsx("absolute -bottom-2 rounded-b-lg z-0 left-0 h-4 w-full", user.active ? "bg-success/60" : "bg-neutral/60")} />
                </div>
                <div className="w-full flex flex-col lg:text-center">
                    <h3 className="overflow-hidden overflow-ellipsis">
                        {user.username}
                    </h3>
                    {user.description && (
                        <p className="label-text">{user.description}</p>
                    )}
                </div>
            </div>
            <div className="flex h-fit gap-4 p-4 border border-secondary/60 bg-secondary/30 rounded-lg">
                <button
                    onClick={() => switchModal('followers')}
                    className="flex-1 flex flex-col gap-1"
                >
                    <p className="label-text text-white">
                        <span className="font-bold">
                            {followStats ? followStats.followers : 0}
                        </span>
                    </p>
                    <p className="label-text">стежать</p>
                </button>
                <button
                    onClick={() => switchModal('followings')}
                    className="flex-1 flex flex-col gap-1"
                >
                    <p className="label-text text-white">
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
                            className="btn btn-outline btn-error w-full"
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
