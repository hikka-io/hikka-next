import type { FC } from 'react';

import { MessageCircle } from 'lucide-react';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import FavoriteButton from '@/components/action-buttons/favorite-button';
import ReadlistButton from '@/components/action-buttons/readlist-button';
import WatchlistButton from '@/components/action-buttons/watchlist-button';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { useSession } from '@/features/auth/hooks/use-session';
import EditButton from '@/features/edit/edit-button';
import { cn } from '@/utils/cn';
import { COMMENT_DECLENSIONS, CONTENT_CONFIG } from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { Link, useParams } from '@/utils/navigation';

type Props = {
    className?: string;
    content_type: MainContentTypeEnum | 'character' | 'person';
};

const UserlistButton = ({ content_type }: Props) => {
    const params = useParams();

    switch (content_type) {
        case ContentTypeEnum.ANIME:
            return (
                <WatchlistButton slug={String(params.slug)} size="icon-md" />
            );
        case ContentTypeEnum.MANGA:
        case ContentTypeEnum.NOVEL:
            return (
                <ReadlistButton
                    slug={String(params.slug)}
                    size="icon-md"
                    content_type={content_type}
                />
            );
        case ContentTypeEnum.PERSON:
        case ContentTypeEnum.CHARACTER:
            return null;
        default:
            return null;
    }
};

const ContentActionBar: FC<Props> = ({ className, content_type }) => {
    const params = useParams();
    const { user: loggedUser } = useSession();

    const { data } = CONTENT_CONFIG[content_type].useInfo(String(params.slug));
    // data_type is a per-response literal; widen to string so the
    // character/person checks below typecheck across the content-type union.
    const dataType = data?.data_type as string | undefined;
    // comments_count is absent on character/person responses in the union
    const commentsCount = (data as { comments_count?: number } | undefined)
        ?.comments_count;

    return (
        <div
            className={cn(
                'sticky bottom-3 z-10 mx-auto flex w-fit md:bottom-4',
                className,
            )}
        >
            <Card
                className="flex-row gap-2 border-none bg-secondary/60 px-3 py-2 backdrop-blur-xl"
                id="navbar-card"
            >
                <UserlistButton content_type={content_type} />
                {content_type !== ContentTypeEnum.PERSON && (
                    <FavoriteButton
                        slug={String(params.slug)}
                        content_type={content_type}
                        size="icon-md"
                        variant="ghost"
                    />
                )}

                <Button asChild size="md" variant="ghost">
                    <Link to={`/comments/${content_type}/${params.slug}`}>
                        <MessageCircle />
                        {dataType !== ContentTypeEnum.CHARACTER &&
                            dataType !== ContentTypeEnum.PERSON && (
                                <span>
                                    {commentsCount}{' '}
                                    <span className="hidden sm:inline">
                                        {getDeclensionWord(
                                            commentsCount ?? 0,
                                            COMMENT_DECLENSIONS,
                                        )}
                                    </span>
                                </span>
                            )}
                        {(dataType === ContentTypeEnum.CHARACTER ||
                            dataType === ContentTypeEnum.PERSON) && (
                            <span className="hidden sm:inline">Коментарі</span>
                        )}
                    </Link>
                </Button>

                {loggedUser && (
                    <>
                        <div className="h-full w-px bg-secondary" />
                        <EditButton
                            key={String(params.slug)}
                            slug={String(params.slug)}
                            content_type={content_type}
                            size="icon-md"
                            variant="ghost"
                        />
                    </>
                )}
            </Card>
        </div>
    );
};

export default ContentActionBar;
