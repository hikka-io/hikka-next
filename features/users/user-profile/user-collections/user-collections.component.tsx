'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react';
import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';

import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import NotFound from '@/components/ui/not-found';

import useSession from '@/services/hooks/auth/use-session';
import useUserCollections from '@/services/hooks/user/use-user-collections';
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

    const { list: collections } = useUserCollections({
        author: String(params.username),
        sort: 'created',
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
                title={'Колекції'}
                onClick={
                    collections && collections?.length > 0
                        ? handleOpenCollectionsModal
                        : undefined
                }
            >
                {loggedUser?.username === params.username && (
                    <Button asChild size="icon-sm" variant="outline">
                        <Link href="/collections/new">
                            <MaterialSymbolsAddRounded />
                        </Link>
                    </Button>
                )}
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
