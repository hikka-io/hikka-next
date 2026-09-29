import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import FavoriteButton from '@/components/action-buttons/favorite-button';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { usePageTitleReveal } from '@/features/app-shell';
import { ContentEditsButton } from '@/features/edit';
import { useSession } from '@/services/session';
import { contentInfoOptions } from '@/utils/api/content-queries';
import { cn } from '@/utils/cn';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { COMMENT_FORMS } from '@/utils/i18n/word-forms';
import { Link, useParams } from '@/utils/navigation';

import ListEntryButton from './list-entry-button';

type Props = {
    className?: string;
    content_type: MainContentTypeEnum | 'character' | 'person';
};

const ContentActionBar: FC<Props> = ({ className, content_type }) => {
    const params = useParams();
    const { user: loggedUser } = useSession();
    const { visible: titleVisible, animated } = usePageTitleReveal();

    const { data } = useQuery(
        contentInfoOptions(content_type, String(params.slug)),
    );
    // data_type is a per-response literal; widen to string so the
    // character/person checks below typecheck across the content-type union.
    const dataType = data?.data_type as string | undefined;
    // comments_count is absent on character/person responses in the union
    const commentsCount = (data as { comments_count?: number } | undefined)
        ?.comments_count;

    return (
        <div
            className={cn(
                'sticky bottom-[calc(var(--tab-bar-height)+1rem)] z-10 mx-auto flex w-fit',
                animated && 'transition-opacity duration-200',
                !titleVisible && 'max-md:pointer-events-none max-md:opacity-0',
                className,
            )}
        >
            <Card
                variant="glass"
                className="flex-row gap-2 px-3 py-2"
                id="navbar-card"
            >
                <ListEntryButton
                    content_type={content_type}
                    content={data}
                    disabled={!loggedUser}
                    size="icon-md"
                />
                <FavoriteButton
                    slug={String(params.slug)}
                    content_type={content_type}
                    size="icon-md"
                    variant="ghost"
                    disabled={!loggedUser}
                />
                <Button
                    size="md"
                    variant="ghost"
                    render={
                        <Link to={`/comments/${content_type}/${params.slug}`} />
                    }
                >
                    <MessageCircle />
                    {dataType !== ContentTypeEnum.CHARACTER &&
                        dataType !== ContentTypeEnum.PERSON && (
                            <span>
                                {commentsCount}{' '}
                                <span className="hidden sm:inline">
                                    {getDeclensionWord(
                                        commentsCount ?? 0,
                                        COMMENT_FORMS,
                                    )}
                                </span>
                            </span>
                        )}
                    {(dataType === ContentTypeEnum.CHARACTER ||
                        dataType === ContentTypeEnum.PERSON) && (
                        <span className="hidden sm:inline">Коментарі</span>
                    )}
                </Button>

                {loggedUser && (
                    <>
                        <div className="h-full w-px bg-border" />
                        <ContentEditsButton
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
