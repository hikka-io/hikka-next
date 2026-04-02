'use client';

import { CollectionContentType } from '@hikka/client';
import { useSearchCollections } from '@hikka/react';
import { FC, useState } from 'react';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';

import CollectionItem from '@/features/users/profile/user-collections/components/collection-item';

import { useCloseOnRouteChange } from '@/services/hooks/use-close-on-route-change';
import { useParams } from '@/utils/navigation';

import CollectionsModal from './collections-modal';

interface Props {
    content_type: CollectionContentType;
}

const Collections: FC<Props> = ({ content_type }) => {
    const params = useParams();
    const [open, setOpen] = useState(false);
    useCloseOnRouteChange(setOpen);

    const { list } = useSearchCollections({
        args: {
            content_type: content_type,
            content: [String(params.slug)],
        },
    });

    if (!list || list.length === 0) return null;

    const filteredCollections = list?.slice(0, 3);

    return (
        <>
            <Card className="bg-secondary/20" id="content-collections">
                <Block>
                    <Header onClick={() => setOpen(true)}>
                        <HeaderContainer>
                            <HeaderTitle variant="h4">Колекції</HeaderTitle>
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
            <ResponsiveModal open={open} onOpenChange={setOpen} type="sheet">
                <ResponsiveModalContent side="right" title="Колекції">
                    <CollectionsModal content_type={content_type} />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default Collections;
