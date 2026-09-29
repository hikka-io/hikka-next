import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import FavoriteButton from '@/components/action-buttons/favorite-button';
import { ReadListButton, WatchListButton } from '@/components/tracking';
import { useSession } from '@/features/auth/hooks/use-session';
import {
    contentInfoOptions,
    listEntryOptions,
} from '@/utils/api/content-queries';
import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';

import UserContentStats from './components/user-content-stats';

type Props = {
    content_type: MainContentTypeEnum;
    className?: string;
};

const ContentActions: FC<Props> = ({ content_type, className }) => {
    const params = useParams();
    const { user } = useSession();

    const { data: userlist, isError } = useQuery(
        listEntryOptions(content_type, String(params.slug)),
    );
    const { data: content } = useQuery(
        contentInfoOptions(content_type, String(params.slug)),
    );

    const hasList = !!userlist && !isError;

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            <div className="flex gap-4">
                <div className="min-w-0 flex-1">
                    {content_type === ContentTypeEnum.ANIME ? (
                        <WatchListButton
                            disabled={!user}
                            slug={String(params.slug)}
                            anime={
                                content?.data_type === 'anime'
                                    ? content
                                    : undefined
                            }
                        />
                    ) : (
                        <ReadListButton
                            content_type={content_type}
                            disabled={!user}
                            slug={String(params.slug)}
                            content={
                                content?.data_type === 'manga' ||
                                content?.data_type === 'novel'
                                    ? content
                                    : undefined
                            }
                        />
                    )}
                </div>
                <FavoriteButton
                    slug={String(params.slug)}
                    content_type={content_type}
                    size="icon"
                    variant="secondary"
                    disabled={!user}
                />
            </div>
            <UserContentStats
                content_type={content_type}
                listItem={hasList ? userlist : undefined}
            />
        </div>
    );
};

export default ContentActions;
