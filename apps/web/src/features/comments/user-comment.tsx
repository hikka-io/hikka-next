import type { FC, MouseEvent } from 'react';

import { useNavigate } from '@tanstack/react-router';
import { uk } from 'date-fns/locale/uk';
import { CornerDownRight } from 'lucide-react';

import type { CommentResponse, ContentTypeEnum } from '@hikka/api';

import AuthorMetaRow from '@/components/author-meta-row';
import { ReviewBadge } from '@/components/badges';
import MDViewer from '@/components/markdown/viewer/md-viewer';
import TextExpand from '@/components/text-expand';
import { Chip } from '@/components/ui/chip';
import { HorizontalCardImage } from '@/components/ui/horizontal-card';
import { StatItemGroup } from '@/components/ui/stat-item';
import FeedContentRef from '@/features/home/widgets/feed-widget/components/feed-content-ref';
import { Link } from '@/utils/navigation';

import CommentMenu from './comment-menu';
import CommentVote from './comment-vote';

type Props = {
    comment: CommentResponse;
};

// `preview` is an opaque record on CommentResponse; narrow it.
type CommentPreview = {
    slug?: string;
    title?: string;
};

const UserComment: FC<Props> = ({ comment }) => {
    const navigate = useNavigate();
    const preview = comment.preview as CommentPreview;
    const href = `/comments/${comment.content_type}/${preview.slug}/${comment.reference}`;

    const handleNavigate = (event: MouseEvent<HTMLDivElement>) => {
        // Spoiler reveals, links, and mentions inside the comment handle
        // their own clicks; only empty-area clicks open the comment thread.
        if ((event.target as HTMLElement).closest('a, button')) return;

        navigate({ to: href });
    };

    return (
        <div className="flex w-full gap-4">
            <HorizontalCardImage
                className="w-10"
                image={comment.author.avatar}
                imageRatio={1}
                to={`/u/${comment.author.username}`}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="relative flex min-w-0 flex-col gap-2 pr-9">
                    <AuthorMetaRow
                        username={comment.author.username}
                        role={comment.author.role}
                        created={comment.created}
                        locale={uk}
                    />
                    {!comment.hidden && (
                        <div className="absolute top-0 right-0">
                            <CommentMenu
                                comment={comment}
                                slug={preview.slug ?? ''}
                                content_type={comment.content_type}
                            />
                        </div>
                    )}
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                        {comment.review?.recommended && (
                            <ReviewBadge
                                recommended={comment.review.recommended}
                                score={comment.review.score}
                            />
                        )}
                        {comment.parent && (
                            <Chip
                                asChild
                                className="shrink-0 bg-secondary/40 text-muted-foreground hover:bg-accent"
                            >
                                <Link
                                    to={`/comments/${comment.content_type}/${preview.slug}/${comment.parent}`}
                                >
                                    <CornerDownRight className="size-3.5" />
                                    Відповідь
                                </Link>
                            </Chip>
                        )}
                        <FeedContentRef
                            contentType={
                                comment.content_type as ContentTypeEnum
                            }
                            slug={preview.slug}
                            title={preview.title}
                        />
                    </div>
                </div>

                {!comment.hidden ? (
                    <TextExpand>
                        {/* biome-ignore lint/a11y/noStaticElementInteractions: click is a supplementary shortcut; the content chip is the primary navigation. */}
                        {/* biome-ignore lint/a11y/useKeyWithClickEvents: click is a supplementary shortcut; the content chip is the primary navigation. */}
                        <div
                            className="cursor-pointer"
                            onClick={handleNavigate}
                        >
                            <MDViewer className="text-[0.9375rem]">
                                {comment.text}
                            </MDViewer>
                        </div>
                    </TextExpand>
                ) : (
                    <p className="text-[0.9375rem] text-muted-foreground">
                        Коментар видалено
                    </p>
                )}

                {!comment.hidden && (
                    <StatItemGroup>
                        <CommentVote comment={comment} />
                    </StatItemGroup>
                )}
            </div>
        </div>
    );
};

export default UserComment;
