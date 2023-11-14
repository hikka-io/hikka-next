'use client';

import Image from '@/app/_components/Image';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import getUserInfo from '@/utils/api/user/getUserInfo';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import getLoggedUserInfo from '@/utils/api/user/getLoggedUserInfo';
import UserFollow from '@/app/_components/icons/UserFollow';
import checkFollow from '@/utils/api/follow/checkFollow';
import UserUnfollow from '@/app/_components/icons/UserUnfollow';
import follow from '@/utils/api/follow/follow';
import unfollow from '@/utils/api/follow/unfollow';
import Preferences from '@/app/_components/icons/Preferences';
import SettingsModal from "@/app/u/[username]/_layout/SettingsModal";
import {useState} from "react";

interface Props {}

const Component = ({}: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const params = useParams();
    const { secret } = useAuthContext();
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

    if (!user) {
        return null;
    }

    if (secret && !loggedUser) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid md:grid-cols-1 grid-cols-[auto_1fr] gap-4">
                <div className="avatar w-32 h-32 md:w-full md:h-full">
                    <div className="w-full rounded-lg">
                        <Image
                            alt="avatar"
                            className="object-contain"
                            width={287}
                            height={287}
                            src={user.avatar}
                        />
                    </div>
                </div>
                <div className="w-full flex flex-col justify-between">
                    <div>
                        <h2>{user.username}</h2>
                        {user.description && <p>{user.description}</p>}
                    </div>
                </div>
            </div>
            {loggedUser && loggedUser.username === user.username && (
                <button
                    onClick={() => setOpen(true)}
                    className="btn btn-secondary"
                >
                    <Preferences /> Налаштування
                </button>
            )}
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
                                <UserUnfollow />
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
                                <UserFollow />
                            )}
                            Відстежувати
                        </button>
                    )
                ) : null
            ) : (
                <button
                    onClick={() => window.authModal.showModal()}
                    className="btn bg-secondary/60 w-full"
                >
                    <UserFollow />
                    Відстежувати
                </button>
            )}
            <SettingsModal open={open} setOpen={setOpen}  />
        </div>
    );
};

export default Component;
