import type { FC } from 'react';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import ReadListButton from '@/components/action-buttons/readlist-button';
import WatchlistButton from '@/components/action-buttons/watchlist-button';
import { useSession } from '@/features/auth/hooks/use-session';
import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';

import UserContentStats from './components/user-content-stats';

type Props = {
    content_type: MainContentTypeEnum;
    className?: string;
};

const Actions: FC<Props> = ({ content_type, className }) => {
    const params = useParams();
    const { user } = useSession();

    return (
        <div
            className={cn(
                'surface flex flex-col overflow-hidden rounded-md border',
                className,
            )}
            id="content-actions"
        >
            {content_type === ContentTypeEnum.ANIME ? (
                <WatchlistButton
                    variant="header"
                    disabled={!user}
                    slug={String(params.slug)}
                />
            ) : (
                <ReadListButton
                    variant="header"
                    content_type={content_type}
                    disabled={!user}
                    slug={String(params.slug)}
                />
            )}
            <UserContentStats content_type={content_type} />
        </div>
    );
};

export default Actions;
