'use client';

import Modal from '@/app/_components/Modal';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useModalContext } from '@/utils/providers/ModalProvider';
import getFollowers from '@/utils/api/follow/getFollowers';
import { useParams } from 'next/navigation';
import getFollowings from '@/utils/api/follow/getFollowings';
import Image from '@/app/_components/Image';
import Link from 'next/link';
import follow from '@/utils/api/follow/follow';
import unfollow from '@/utils/api/follow/unfollow';

type FormValues = {
    score: number;
    episodes: number;
    note: string;
};

interface Props {}

const Component = ({}: Props) => {
    const params = useParams();
    const { followings, followers, closeModals } = useModalContext();
    const { secret } = useAuthContext();
    const queryClient = useQueryClient();

    const { mutate: mutateFollow, isLoading: followLoading } = useMutation({
        mutationKey: ['follow', secret],
        mutationFn: (username: string) =>
            follow({
                secret: String(secret),
                username: String(username),
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });

    const { mutate: mutateUnfollow, isLoading: unfollowLoading } = useMutation({
        mutationKey: ['unfollow', secret],
        mutationFn: (username: string) =>
            unfollow({
                secret: String(secret),
                username: String(username),
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });

    const { data: followersData } = useQuery({
        queryKey: ['followers', params.username, secret],
        queryFn: () =>
            getFollowers({
                username: String(params.username),
                secret: String(secret),
            }),
        staleTime: 0,
        enabled: followers,
    });

    const { data: followingsData } = useQuery({
        queryKey: ['followings', params.username, secret],
        queryFn: () =>
            getFollowings({
                username: String(params.username),
                secret: String(secret),
            }),
        staleTime: 0,
        enabled: followings,
    });

    if (followers && !followersData) {
        return null;
    }

    if (followings && !followingsData) {
        return null;
    }

    if (!followers && !followings) {
        return null;
    }

    return (
        <Modal
            open={Boolean(followings) || Boolean(followers)}
            onDismiss={closeModals}
            id="followListModal"
            boxClassName="p-0 !max-w-md"
            title={followers ? 'Стежать' : 'Відстежується'}
        >
            {(followers || followings) && (
                <div className="overflow-y-auto py-4">
                    {(followings ? followingsData : followersData)!.list.map(
                        (user) => {
                            return (
                                <div
                                    key={user.reference}
                                    className="flex gap-4 justify-between items-center py-4 px-8"
                                >
                                    <div className="flex gap-3">
                                        <Link
                                            href={'/u/' + user.username}
                                            className="avatar"
                                        >
                                            <div className="w-10 rounded-md">
                                                <Image
                                                    src={user.avatar}
                                                    width={40}
                                                    height={40}
                                                    alt="avatar"
                                                />
                                            </div>
                                        </Link>
                                        <div className="flex flex-col justify-between">
                                            <Link
                                                href={'/u/' + user.username}
                                                className="label-text !text-base-content font-bold"
                                            >
                                                {user.username}
                                            </Link>
                                            <p className="label-text-alt opacity-60">
                                                {user.description}
                                            </p>
                                        </div>
                                    </div>
                                    {'is_followed' in user ? (
                                        !user.is_followed ? (
                                            <button
                                                onClick={() =>
                                                    mutateFollow(user.username)
                                                }
                                                className="btn btn-sm btn-secondary"
                                            >
                                                Відстежувати
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    mutateUnfollow(
                                                        user.username,
                                                    )
                                                }
                                                className="btn btn-sm btn-error btn-outline"
                                            >
                                                Не Стежити
                                            </button>
                                        )
                                    ) : null}
                                </div>
                            );
                        },
                    )}
                </div>
            )}
        </Modal>
    );
};

export default Component;
