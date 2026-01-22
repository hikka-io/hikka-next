'use client';

import { CollectionContentType } from '@hikka/client';
import { useSearchCollections } from '@hikka/react';
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

import CollectionItem from '@/features/users/user-profile/components/user-collections/collection-item';
import ContentCollectionsModal from './components/content-collections/content-collections-modal';

interface Props {
    content_type: CollectionContentType;
}

const ContentCollections: FC<Props> = ({ content_type }) => {
    const params = useParams();
    const { openModal } = useModalContext();

    const { list } = useSearchCollections({
        args: {
            content_type: content_type,
            content: [String(params.slug)],
        },
    });

    const handleOpenContentCollectionsModal = () => {
        openModal({
            type: 'sheet',
            title: 'Колекції',
            side: 'right',
            content: <ContentCollectionsModal content_type={content_type} />,
        });
    };

    if (!list || list.length === 0) return null;

    const filteredCollections = list?.slice(0, 3);

    return (
        <Block>
            <Header onClick={handleOpenContentCollectionsModal}>
                <HeaderContainer>
                    <HeaderTitle>Колекції</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <div className="flex flex-col gap-6">
                {filteredCollections.map((collection) => (
                    <CollectionItem key={collection.reference} data={collection} />
                ))}
            </div>
        </Block>
    );
};

export default ContentCollections;