import type { ComponentProps, FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';
import { useSession } from '@hikka/react';

import ReadListButton from '@/components/action-buttons/readlist-button';
import WatchlistButton from '@/components/action-buttons/watchlist-button';
import { useParams } from '@/utils/navigation';

import UserContentStats from './components/user-content-stats';

type Props = {
    content_type: 'anime' | 'manga' | 'novel';
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
                        additional
                        slug={String(params.slug)}
                    />
                ) : (
                    <ReadListButton
                        // TODO(phase2): drop cast once readlist-button reads @hikka/api enum
                        content_type={
                            content_type as ComponentProps<
                                typeof ReadListButton
                            >['content_type']
                        }
                        disabled={!user}
                        additional
                        slug={String(params.slug)}
                    />
                )}
                <UserContentStats content_type={content_type} />
            </div>
        </div>
    );
};

export default Actions;
