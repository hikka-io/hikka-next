'use client';

import { ContentTypeEnum, ReadContentType } from '@hikka/client';
import { useFollowingReaders, useFollowingWatchers } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';

import { useModalContext } from '@/services/providers/modal-provider';

import FollowingReadItem from './following-read-item';
import FollowingWatchItem from './following-watch-item';
import FollowingsModal from './followings-modal';

interface Props {
    content_type: ContentTypeEnum;
}

const Followings: FC<Props> = ({ content_type }) => {
    const params = useParams();
    const { openModal } = useModalContext();

    const watchListQuery = useFollowingWatchers({
        slug: String(params.slug),
        options: { enabled: content_type === ContentTypeEnum.ANIME },
    });

    const readListQuery = useFollowingReaders({
        slug: String(params.slug),
        contentType: content_type as ReadContentType,
        options: { enabled: content_type !== ContentTypeEnum.ANIME },
    });

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
