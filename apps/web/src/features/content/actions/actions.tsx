import type { FC } from 'react';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import ReadListButton from '@/components/action-buttons/readlist-button';
import WatchlistButton from '@/components/action-buttons/watchlist-button';
import { useSession } from '@/features/auth/hooks/use-session';
import { useParams } from '@/utils/navigation';

import UserContentStats from './components/user-content-stats';

type Props = {
    content_type: MainContentTypeEnum;
};

const Actions: FC<Props> = ({ content_type }) => {
    const params = useParams();
    const { user } = useSession();

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
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
                <UserContentStats content_type={content_type} />
            </div>
        </div>
    );
};

export default Actions;
