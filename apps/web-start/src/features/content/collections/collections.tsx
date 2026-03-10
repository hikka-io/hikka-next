'use client';

import { CollectionContentType } from '@hikka/client';
import { useSearchCollections } from '@hikka/react';
import { useParams } from '@/utils/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';

import CollectionItem from '@/features/users/profile/user-collections/components/collection-item';

import { useModalContext } from '@/services/providers/modal-provider';

import Card from '@/components/ui/card';
import CollectionsModal from './collections-modal';

interface Props {
    content_type: CollectionContentType;
}

const Collections: FC<Props> = ({ content_type }) => {
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
            content: <CollectionsModal content_type={content_type} />,
        });
    };

    if (!list || list.length === 0) return null;

    const filteredCollections = list?.slice(0, 3);

    return (
        <Card className='bg-secondary/20'>
            <Block>
                <Header onClick={handleOpenContentCollectionsModal}>
                    <HeaderContainer>
                        <HeaderTitle variant='h4'>Колекції</HeaderTitle>
                    </HeaderContainer>
                    <HeaderNavButton />
                </Header>
                <div className="flex flex-col gap-6">
                    {filteredCollections.map((collection) => (
                        <CollectionItem
                            key={collection.reference}
                            data={collection}
                        />
                    ))}
                </div>
            </Block>
        </Card>
    );
};

export default Collections;
