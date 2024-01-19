'use client';

import { formatDistance } from 'date-fns';
import MaterialSymbolsImageOutlineRounded from '~icons/material-symbols/image-outline-rounded';

import Image from '@/app/_components/image';
import { Button } from '@/app/_components/ui/button';

interface CommentProps {
    comment: Hikka.Comment;
}

interface CommentsProps {
    comments: Hikka.Comment[];
}

const DATA: Hikka.Comment[] = [
    {
        comment_id: 1,
        user: {
            reference: '49c60ffe-c1d8-45a7-ace7-531b19ec3d98',
            description: 'O tempora, o mores!',
            username: 'olexh',
            created: 1696430968,
            avatar: 'https://cdn.hikka.io/avatar.jpg',
            role: 'admin',
            active: true,
        },
        created_at: 1696430968,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel risus vitae dolor varius porta. Nam vestibulum lectus ac odio volutpat, id vehicula nisi bibendum',
        comments: [
            {
                comment_id: 1,
                user: {
                    reference: '49c60ffe-c1d8-45a7-ace7-531b19ec3d98',
                    description: 'O tempora, o mores!',
                    username: 'olexh',
                    created: 1696430968,
                    avatar: 'https://cdn.hikka.io/avatar.jpg',
                    role: 'admin',
                    active: true,
                },
                created_at: 1696430968,
                text: 'Aenean vel mi blandit diam scelerisque lobortis a ut mauris.',
                comments: [
                    {
                        comment_id: 1,
                        user: {
                            reference: '49c60ffe-c1d8-45a7-ace7-531b19ec3d98',
                            description: 'O tempora, o mores!',
                            username: 'olexh',
                            created: 1696430968,
                            avatar: 'https://cdn.hikka.io/avatar.jpg',
                            role: 'admin',
                            active: true,
                        },
                        created_at: 1696430968,
                        text: 'Aliquam blandit velit a lobortis semper. Quisque aliquam tempor turpis id eleifend. Aenean a massa sed leo faucibus maximus pharetra et massa. Aenean vel felis eleifend, sagittis augue pellentesque, placerat diam. Ut faucibus mi lorem. Maecenas ullamcorper quam mauris, a accumsan mi aliquam pellentesque. Nullam accumsan orci a nisi rhoncus, sit amet vehicula neque ultrices. Suspendisse congue enim id lobortis laoreet. Vestibulum in dignissim felis.',
                        comments: [],
                    },
                ],
            },
            {
                comment_id: 1,
                user: {
                    reference: '49c60ffe-c1d8-45a7-ace7-531b19ec3d98',
                    description: 'O tempora, o mores!',
                    username: 'olexh',
                    created: 1696430968,
                    avatar: 'https://cdn.hikka.io/avatar.jpg',
                    role: 'admin',
                    active: true,
                },
                created_at: 1696430968,
                text: 'Curabitur accumsan lacus nibh, in molestie augue tempor at. Vivamus tempus pretium iaculis. Integer lacinia laoreet lacus vitae rhoncus. Morbi mattis venenatis sapien, eu tempus magna viverra id. Nullam in leo non elit facilisis convallis. Quisque sit amet turpis ac risus maximus volutpat.',
                comments: [],
            },
        ],
    },
    {
        comment_id: 1,
        user: {
            reference: '49c60ffe-c1d8-45a7-ace7-531b19ec3d98',
            description: 'O tempora, o mores!',
            username: 'olexh',
            created: 1696430968,
            avatar: 'https://cdn.hikka.io/avatar.jpg',
            role: 'admin',
            active: true,
        },
        created_at: 1696430968,
        text: 'Phasellus nec elementum nulla. In scelerisque ligula a libero vulputate tempor. Quisque tempor sapien quis leo congue, vel dignissim augue malesuada. Aenean rutrum, tellus vel porta pulvinar, dui metus euismod mi, in pulvinar odio ligula vitae leo. Curabitur eu lobortis nibh, ullamcorper aliquam nibh.',
        comments: [],
    },
];

const Comment = ({ comment }: CommentProps) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <div className="flex gap-3">
                    <div className="avatar">
                        <div className="w-10 rounded-md">
                            <Image
                                src={comment.user.avatar}
                                width={40}
                                height={40}
                                alt="avatar"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col justify-between">
                        <p className="label-text font-bold !text-base-content">
                            {comment.user.username}
                        </p>
                        <p className="label-text-alt opacity-60">
                            {formatDistance(
                                comment.created_at * 1000,
                                Date.now(),
                                { addSuffix: true },
                            )}
                        </p>
                    </div>
                </div>
                <p>{comment.text}</p>
                <div>
                    <Button variant="ghost" size="sm">
                        Відповісти
                    </Button>
                </div>
            </div>
            {comment.comments.length > 0 && (
                <div className="flex gap-6">
                    <div className="h-full w-[1px] bg-secondary" />
                    <Comments comments={comment.comments} />
                </div>
            )}
        </div>
    );
};

const Comments = ({ comments }: CommentsProps) => {
    return (
        <div className="flex flex-col gap-4">
            {comments.map((comment) => (
                <Comment comment={comment} key={comment.comment_id} />
            ))}
        </div>
    );
};

const Component = () => {
    return (
        <div className="flex flex-col gap-8">
            <h3>Коментарі</h3>
            <div className="relative">
                <textarea
                    rows={5}
                    className="textarea w-full bg-secondary/60 text-base"
                />
                <div className="absolute bottom-4 left-2">
                    <button className="btn btn-square btn-secondary btn-ghost btn-sm">
                        <MaterialSymbolsImageOutlineRounded />
                    </button>
                </div>
            </div>
            <Comments comments={DATA} />
        </div>
    );
};

export default Component;
