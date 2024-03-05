'use client';

import { useParams } from 'next/navigation';

import SubHeader from '@/components/sub-header';
import NotFound from '@/components/ui/not-found';
import { useAuthContext } from '@/services/providers/auth-provider';
import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils';

import CollectionsModal from './components/collections-modal';
import CollectionItem from './components/ui/collection-item';
import { Button } from '@/components/ui/button';

import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded'
import Link from 'next/link';
import useUserCollections from '@/services/hooks/user/useUserCollections';
import useLoggedUser from '@/services/hooks/user/useLoggedUser';

interface Props {
    className?: string;
}

const Component = ({ className }: Props) => {
    const params = useParams();
    const { openModal } = useModalContext();
    const { secret } = useAuthContext();

    const { data: loggedUser } = useLoggedUser();

    const { list: collections } = useUserCollections({
        username: String(params.username),
        secret: secret,
    });

    if (!collections) {
        return null;
    }

    if (collections?.length === 0 && loggedUser?.username !== params.username) {
        return null;
    }

    const filteredCollections = collections?.slice(0, 3);

    return (
        <div className={cn('flex flex-col gap-8', className)}>
            <SubHeader
                title={'Колекції'}
                onClick={
                    collections && collections?.length > 0
                        ? () =>
                              openModal({
                                  type: 'sheet',
                                  title: 'Колекції',
                                  side: 'right',
                                  content: <CollectionsModal />,
                              })
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
            </SubHeader>
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
        </div>
    );
};

export default Component;
