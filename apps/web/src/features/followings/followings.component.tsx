'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import useFollowingReadList from '@/services/hooks/read/use-following-read-list';
import useFollowingWatchList from '@/services/hooks/watch/use-following-watch-list';
import { useModalContext } from '@/services/providers/modal-provider';
import Block from '../../components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '../../components/ui/header';
import FollowingReadItem from './following-read-item';
import FollowingWatchItem from './following-watch-item';
import FollowingsModal from './followings-modal';

interface Props {
    content_type: API.ContentType;
}

const Followings: FC<Props> = ({ content_type }) => {
    const params = useParams();
    const { openModal } = useModalContext();

    const watchListQuery = useFollowingWatchList(
        {
            slug: String(params.slug),
        },
        { enabled: content_type === 'anime' },
    );

    const readListQuery = useFollowingReadList(
        {
            slug: String(params.slug),
            content_type: content_type as 'manga' | 'novel',
        },
        { enabled: content_type !== 'anime' },
    );

    const list =
        content_type === 'anime' ? watchListQuery.list : readListQuery.list;

    if (!list || list.length === 0) {
        return null;
    }

    const filteredFollowings = list?.slice(0, 3);

    const handleOpenFollowingsModal = () => {
        openModal({
            type: 'sheet',
            title: 'Відстежується',
            side: 'right',
            content: <FollowingsModal content_type={content_type} />,
        });
    };

    const title = (
        <span>
            Відстежується{' '}
            {list && (
                <span className="text-muted-foreground">({list.length})</span>
            )}
        </span>
    );

    return (
        <Block>
            <Header onClick={handleOpenFollowingsModal}>
                <HeaderContainer>
                    <HeaderTitle>{title}</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <div className="flex flex-col gap-6">
                {filteredFollowings.map((item) =>
                    'watch' in item ? (
                        <FollowingWatchItem data={item} key={item.reference} />
                    ) : (
                        <FollowingReadItem data={item} key={item.reference} />
                    ),
                )}
            </div>
        </Block>
    );
};

export default Followings;
