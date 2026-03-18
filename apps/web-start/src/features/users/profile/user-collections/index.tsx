'use client';

import { useSearchCollections, useSession } from '@hikka/react';
import { Link } from '@/utils/navigation';
import { useParams } from '@/utils/navigation';
import { FC, useState } from 'react';

import { useCloseOnRouteChange } from '@/services/hooks/use-close-on-route-change';
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
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';

import { cn } from '@/utils/cn';

import Card from '@/components/ui/card';
import CollectionItem from './components/collection-item';
import CollectionsModal from './components/collections-modal';

interface Props {
    className?: string;
}

const UserCollections: FC<Props> = ({ className }) => {
    const params = useParams();
    const [open, setOpen] = useState(false);
    useCloseOnRouteChange(setOpen);

    const { user: loggedUser } = useSession();

    const { list: collections } = useSearchCollections({
        args: {
            author: String(params.username),
            sort: ['created:desc'],
            only_public: false,
        },
    });

    if (!collections) {
        return null;
    }

    if (collections?.length === 0 && loggedUser?.username !== params.username) {
        return null;
    }

    const filteredCollections = collections?.slice(0, 3);

    return (
        <>
            <Card className={cn('bg-secondary/20', className)}>
                <Block>
                    <Header
                        onClick={
                            collections && collections?.length > 0
                                ? () => setOpen(true)
                                : undefined
                        }
                    >
                        <HeaderContainer>
                            <HeaderTitle variant="h4">Колекції</HeaderTitle>
                            {loggedUser?.username === params.username && (
                                <Button asChild size="icon-sm" variant="outline">
                                    <Link to="/collections/new">
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
            </Card>
            <ResponsiveModal open={open} onOpenChange={setOpen} type="sheet">
                <ResponsiveModalContent side="right" title="Колекції">
                    <CollectionsModal />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default UserCollections;
