'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';

import Image from '@/app/_components/Image';
import Modal from '@/app/_components/Modal';
import follow from '@/utils/api/follow/follow';
import getFollowers, {
    Response as FollowersResponse,
} from '@/utils/api/follow/getFollowers';
import getFollowings, {
    Response as FollowingsResponse,
} from '@/utils/api/follow/getFollowings';
import unfollow from '@/utils/api/follow/unfollow';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useModalContext } from '@/utils/providers/ModalProvider';


type FormValues = {
    score: number;
    episodes: number;
    note: string;
};

interface Props {}

const Component = ({}: Props) => {
    const { ref, inView } = useInView();
    const params = useParams();
    const { followings, followers, closeModals } = useModalContext();
    const { secret } = useAuthContext();
    const queryClient = useQueryClient();

    const loggedUser: Hikka.User | undefined = queryClient.getQueryData([
        'loggedUser',
    ]);

    const { mutate: mutateFollow } = useMutation({
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

    const { mutate: mutateUnfollow } = useMutation({
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

    const {
        data: followersData,
        fetchNextPage: fetchNextFollowers,
        isFetchingNextPage: isFetchingNextFollowers,
        hasNextPage: hasNextFollowers,
    } = useInfiniteQuery({
        queryKey: ['followers', params.username, secret],
        queryFn: () =>
            getFollowers({
                username: String(params.username),
                secret: String(secret),
            }),
        getNextPageParam: (lastPage: FollowersResponse) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? undefined : nextPage;
        },
        staleTime: 0,
        enabled: followers,
    });

    const {
        data: followingsData,
        fetchNextPage: fetchNextFollowings,
        isFetchingNextPage: isFetchingNextFollowings,
        hasNextPage: hasNextFollowings,
    } = useInfiniteQuery({
        queryKey: ['followings', params.username, secret],
        queryFn: () =>
            getFollowings({
                username: String(params.username),
                secret: String(secret),
            }),
        getNextPageParam: (lastPage: FollowingsResponse) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? undefined : nextPage;
        },
        staleTime: 0,
        enabled: followings,
    });

    useEffect(() => {
        if (inView) {
            if (hasNextFollowers) {
                fetchNextFollowers();
            } else {
                fetchNextFollowings();
            }
        }
    }, [inView]);

    if (followers && !followersData) {
        return null;
    }

    if (followings && !followingsData) {
        return null;
    }

    if (!followers && !followings) {
        return null;
    }

    const followersList =
        followersData && followersData!.pages.map((data) => data.list).flat(1);
    const followingsList =
        followingsData &&
        followingsData!.pages.map((data) => data.list).flat(1);

    return (
        <Modal
            open={Boolean(followings) || Boolean(followers)}
            onDismiss={closeModals}
            id="followListModal"
            boxClassName="p-0 !max-w-md flex flex-col"
            title={followers ? 'Стежать' : 'Відстежується'}
        >
            {(followers || followings) && (
                <div className="overflow-y-scroll py-4 border-t border-secondary mt-4">
                    {(followings ? followingsList : followersList)!.map(
                        (user) => {
                            return (
                                <div
                                    key={user.reference}
                                    className="flex items-center justify-between gap-4 px-8 py-4"
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
                                                className="label-text font-bold !text-base-content"
                                            >
                                                {user.username}
                                            </Link>
                                            <p className="label-text-alt opacity-60">
                                                {user.description}
                                            </p>
                                        </div>
                                    </div>
                                    {secret && user.username !== loggedUser?.username &&
                                        ('is_followed' in user ? (
                                            !user.is_followed ? (
                                                <button
                                                    onClick={() =>
                                                        mutateFollow(
                                                            user.username,
                                                        )
                                                    }
                                                    className="btn btn-secondary btn-sm"
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
                                                    className="btn btn-error btn-outline btn-sm"
                                                >
                                                    Не Стежити
                                                </button>
                                            )
                                        ) : null)}
                                </div>
                            );
                        },
                    )}
                    {(hasNextFollowings || hasNextFollowers) && (
                        <div className="px-4">
                            <button
                                ref={ref}
                                disabled={
                                    isFetchingNextFollowers ||
                                    isFetchingNextFollowings
                                }
                                onClick={() =>
                                    hasNextFollowings
                                        ? fetchNextFollowers()
                                        : fetchNextFollowings()
                                }
                                className="btn btn-secondary w-full"
                            >
                                {(isFetchingNextFollowers ||
                                    isFetchingNextFollowings) && (
                                    <span className="loading loading-spinner"></span>
                                )}
                                Заванатажити ще
                            </button>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default Component;