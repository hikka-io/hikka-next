import { type FC, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { LayoutGrid, MessageCircle, Star } from 'lucide-react';

import {
    type CommentContentTypeEnum as CommentsContentType,
    getCommentsListInfiniteOptions,
    threadOptions,
} from '@hikka/api';

import AntDesignArrowDownOutlined from '@/components/icons/ant-design/AntDesignArrowDownOutlined';
import MaterialSymbolsAddCommentRounded from '@/components/icons/material-symbols/MaterialSymbolsAddCommentRounded';
import MaterialSymbolsLockOpenRounded from '@/components/icons/material-symbols/MaterialSymbolsLockOpenRounded';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { type ChipTabOption, ChipTabs } from '@/components/ui/chip-tabs';
import EmptyState from '@/components/ui/empty-state';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { LoginButton } from '@/features/app-shell';
import { useSession } from '@/features/auth/hooks/use-session';
import CommentsProvider from '@/services/providers/comments-provider';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

import CommentInput from './comment-input';
import { CommentListSkeleton } from './comment-skeleton';
import Comments from './comments';

type CommentType = 'all' | 'comment' | 'review';

const COMMENT_TYPE_OPTIONS: ChipTabOption<CommentType>[] = [
    {
        label: 'Всі',
        value: 'all',
        icon: LayoutGrid,
    },
    {
        label: 'Коментарі',
        value: 'comment',
        icon: MessageCircle,
        activeClass:
            'border border-feed-comment/40 bg-feed-comment/15 text-feed-comment',
    },
    {
        label: 'Відгуки',
        value: 'review',
        icon: Star,
        activeClass:
            'border border-feed-review/40 bg-feed-review/15 text-feed-review',
    },
];

type Props = {
    slug: string;
    content_type: CommentsContentType;
    comment_reference?: string;
    preview?: boolean;
    className?: string;
    contentTitle?: string;
};

const CommentList: FC<Props> = ({
    slug,
    content_type,
    comment_reference,
    preview,
    className,
    contentTitle,
}) => {
    const { user: loggedUser } = useSession();
    const hasReviews = ['anime', 'manga', 'novel'].includes(content_type);
    const [commentType, setCommentType] = useState<CommentType>('all');
    const {
        list: comments,
        pagination,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        ref,
    } = useInfiniteList(
        getCommentsListInfiniteOptions({
            path: { content_type, slug },
            query: {
                comment_type: commentType,
                ...(preview ? { size: 3 } : undefined),
            },
        }),
        { enabled: !comment_reference },
    );

    const { data: thread } = useQuery({
        ...threadOptions({
            path: { comment_reference: String(comment_reference) },
        }),
        enabled: !!comment_reference,
    });

    const list = comment_reference
        ? thread
            ? Array.isArray(thread)
                ? thread
                : [thread]
            : []
        : comments;

    const title = (
        <span>
            Обговорення{' '}
            {pagination && !comment_reference && (
                <span className="text-muted-foreground">
                    ({pagination.total})
                </span>
            )}
        </span>
    );

    return (
        <Block className={cn('break-inside-avoid', className)} id="comments">
            <Header href={`/comments/${content_type}/${slug}`}>
                <HeaderContainer>
                    <HeaderTitle>{title}</HeaderTitle>
                    {comment_reference && (
                        <Button size="md" variant="outline">
                            <Link to={`/comments/${content_type}/${slug}`}>
                                Всі коментарі
                            </Link>
                        </Button>
                    )}
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <CommentsProvider>
                <div className="flex flex-col gap-4">
                    {hasReviews && !comment_reference && (
                        <ChipTabs
                            options={COMMENT_TYPE_OPTIONS}
                            value={commentType}
                            onValueChange={setCommentType}
                        />
                    )}
                    {!loggedUser && (
                        <EmptyState
                            bordered
                            icon={<MaterialSymbolsLockOpenRounded />}
                            title={<span>Ви не авторизовані</span>}
                            description="Увійдіть у свій акаунт, щоб залишити коментар"
                            action={
                                <LoginButton
                                    variant="default"
                                    size="md"
                                    className="w-full lg:w-auto"
                                    asChild
                                />
                            }
                        />
                    )}
                    {loggedUser && !comment_reference && (
                        <CommentInput
                            slug={slug}
                            content_type={content_type}
                            contentTitle={contentTitle}
                        />
                    )}
                    {!comment_reference && isLoading && <CommentListSkeleton />}
                    {list &&
                        list.length === 0 &&
                        (commentType === 'review' ? (
                            <EmptyState
                                bordered
                                icon={<Star />}
                                title={<span>Відгуків не знайдено</span>}
                                description="Тут з'являться відгуки, щойно хтось поділиться враженнями"
                            />
                        ) : (
                            <EmptyState
                                bordered
                                icon={<MaterialSymbolsAddCommentRounded />}
                                title={<span>Коментарів не знайдено</span>}
                                description="Ви можете розпочати обговорення першим"
                            />
                        ))}
                    {list && (
                        <Comments
                            slug={slug}
                            content_type={content_type}
                            contentTitle={contentTitle}
                            comments={list}
                        />
                    )}
                    {hasNextPage && !preview && (
                        <LoadMoreButton
                            isFetchingNextPage={isFetchingNextPage}
                            fetchNextPage={fetchNextPage}
                            ref={ref}
                        />
                    )}
                    {list && list.length !== 0 && preview && (
                        <Button variant="outline" asChild>
                            <Link to={`/comments/${content_type}/${slug}`}>
                                <AntDesignArrowDownOutlined />
                                Переглянути всі
                            </Link>
                        </Button>
                    )}
                </div>
            </CommentsProvider>
        </Block>
    );
};

export default CommentList;
