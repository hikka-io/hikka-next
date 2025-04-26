'use client';

import { useSearchCollections, useSession } from '@hikka/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import NotFound from '@/components/ui/not-found';

import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

import CollectionItem from './collection-item';
import CollectionsModal from './collections-modal';

interface Props {
    className?: string;
}

const UserCollections: FC<Props> = ({ className }) => {
    const params = useParams();
    const { openModal } = useModalContext();

    const { user: loggedUser } = useSession();

    const { list: collections } = useSearchCollections({
        args: {
            author: String(params.username),
            sort: ['created:desc'],
        },
    });

    if (!collections) {
        return null;
    }

    if (collections?.length === 0 && loggedUser?.username !== params.username) {
        return null;
    }

    const filteredCollections = collections?.slice(0, 3);

    const handleOpenCollectionsModal = () => {
        openModal({
            type: 'sheet',
            title: 'Колекції',
            side: 'right',
            content: <CollectionsModal />,
        });
    };

    return (
        <Block className={cn(className)}>
            <Header
                onClick={
                    collections && collections?.length > 0
                        ? handleOpenCollectionsModal
                        : undefined
                }
            >
                <HeaderContainer>
                    <HeaderTitle>Колекції</HeaderTitle>
                    {loggedUser?.username === params.username && (
                        <Button asChild size="icon-sm" variant="outline">
                            <Link href="/collections/new">
                                <MaterialSymbolsAddRounded />
                            </Link>
                        </Button>
                    )}
                </HeaderContainer>
                <HeaderNavButton />
            </Header>

            <div className="flex flex-col gap-6">
                {filteredCollections &&
                    filteredCollections.map((item) => (
                        <CollectionItem data={item} key={item.reference} />
                    ))}
                {collections && collections?.length === 0 && (
                    <NotFound
                        title={'Колекції відсутні'}
                        description="Створіть свою першу колекцію"
                    />
                )}
            </div>
        </Block>
    );
};

export default UserCollections;
