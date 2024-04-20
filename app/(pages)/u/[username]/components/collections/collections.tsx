'use client';

import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import NotFound from '@/components/ui/not-found';
import useLoggedUser from '@/services/hooks/user/useLoggedUser';
import useUserCollections from '@/services/hooks/user/useUserCollections';
import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

import CollectionsModal from './components/collections-modal';
import CollectionItem from './components/ui/collection-item';

interface Props {
    className?: string;
}

const Component = ({ className }: Props) => {
    const params = useParams();
    const { openModal } = useModalContext();

    const { data: loggedUser } = useLoggedUser();

    const { list: collections } = useUserCollections({
        username: String(params.username),
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

export default Component;
