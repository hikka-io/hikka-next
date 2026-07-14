import type { FC } from 'react';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import ReadListButton from '@/components/action-buttons/readlist-button';
import WatchlistButton from '@/components/action-buttons/watchlist-button';
import { useSession } from '@/features/auth/hooks/use-session';
import { cn } from '@/utils/cn';
import { CONTENT_CONFIG } from '@/utils/constants/common';
import { useParams } from '@/utils/navigation';

import UserContentStats from './components/user-content-stats';

type Props = {
    content_type: MainContentTypeEnum;
    className?: string;
};

const Actions: FC<Props> = ({ content_type, className }) => {
    const params = useParams();
    const { user } = useSession();

    const { data: userlist, isError } = CONTENT_CONFIG[
        content_type
    ].useUserlistRecord(String(params.slug));

    const hasList = !!userlist && !isError;

    return (
        <div className={cn('flex flex-col', className)}>
            <div className={cn(hasList && '[&_button]:rounded-b-none')}>
                {content_type === ContentTypeEnum.ANIME ? (
                    <WatchlistButton
                        disabled={!user}
                        slug={String(params.slug)}
                    />
                ) : (
                    <ReadListButton
                        content_type={content_type}
                        disabled={!user}
                        slug={String(params.slug)}
                    />
                )}
            </div>
            <UserContentStats
                content_type={content_type}
                listItem={hasList ? userlist : undefined}
            />
        </div>
    );
};

export default Actions;
