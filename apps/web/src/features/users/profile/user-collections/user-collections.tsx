import { type FC, useState } from 'react';

import { getCollectionsInfiniteOptions } from '@hikka/api';

import { CollectionItem } from '@/components/content-card';
import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsGridViewRounded from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
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
import { useSession } from '@/features/auth/hooks/use-session';
import { useCloseOnRouteChange } from '@/services/hooks/use-close-on-route-change';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { Link, useParams } from '@/utils/navigation';

import CollectionsModal from './components/collections-modal';

type Props = {
    className?: string;
};

const UserCollections: FC<Props> = ({ className }) => {
    const params = useParams();
    const [open, setOpen] = useState(false);
    useCloseOnRouteChange(setOpen);

    const { user: loggedUser } = useSession();

    const { list: collections } = useInfiniteList(
        getCollectionsInfiniteOptions({
            body: {
                author: String(params.username),
                sort: ['created:desc'],
                only_public: false,
            },
        }),
    );

    if (!collections) {
        return null;
    }

    if (collections?.length === 0 && loggedUser?.username !== params.username) {
        return null;
    }

    const filteredCollections = collections?.slice(0, 3);

    return (
        <>
            <Card
                className={cn('bg-secondary/20', className)}
                id="user-collections"
            >
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
                                <Button
                                    asChild
                                    size="icon-sm"
                                    variant="outline"
                                >
                                    <Link to="/collections/new">
                                        <MaterialSymbolsAddRounded />
                                    </Link>
                                </Button>
                            )}
                        </HeaderContainer>
                        <HeaderNavButton />
                    </Header>

                    <div className="flex flex-col gap-6">
                        {filteredCollections?.map((item) => (
                            <CollectionItem data={item} key={item.reference} />
                        ))}
                        {collections && collections?.length === 0 && (
                            <EmptyState
                                icon={<MaterialSymbolsGridViewRounded />}
                                title="Колекції відсутні"
                                description="Створіть свою першу колекцію"
                                action={
                                    <Button
                                        variant="secondary"
                                        size="md"
                                        asChild
                                    >
                                        <Link to="/collections/new">
                                            <MaterialSymbolsAddRounded />
                                            Створити колекцію
                                        </Link>
                                    </Button>
                                }
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
