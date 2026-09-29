import { type FC, useState } from 'react';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsGridViewRounded from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import { CollectionItem } from '@/components/list-items';
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
import { CollectionListModal } from '@/features/collections';
import { useCloseOnRouteChange } from '@/services/hooks/use-close-on-route-change';
import { useSession } from '@/services/session';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { Link, useParams } from '@/utils/navigation';

import {
    userCollectionsPreviewBody,
    userCollectionsPreviewOptions,
} from '../queries';

type Props = {
    className?: string;
};

const UserCollections: FC<Props> = ({ className }) => {
    const params = useParams();
    const [open, setOpen] = useState(false);
    useCloseOnRouteChange(setOpen);

    const { user: loggedUser } = useSession();

    const body = userCollectionsPreviewBody(String(params.username));

    const { list: collections } = useInfiniteList(
        userCollectionsPreviewOptions(String(params.username)),
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
            <Card className={cn(className)} id="user-collections">
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
                                    size="icon-sm"
                                    variant="outline"
                                    render={<Link to="/collections/new" />}
                                >
                                    <MaterialSymbolsAddRounded />
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
                                        render={<Link to="/collections/new" />}
                                    >
                                        <MaterialSymbolsAddRounded />
                                        Створити колекцію
                                    </Button>
                                }
                            />
                        )}
                    </div>
                </Block>
            </Card>
            <ResponsiveModal open={open} onOpenChange={setOpen} type="sheet">
                <ResponsiveModalContent side="right" title="Колекції">
                    <CollectionListModal
                        body={body}
                        emptyState={
                            <EmptyState
                                icon={<MaterialSymbolsGridViewRounded />}
                                title="Колекції відсутні"
                                description="Тут з’являться колекції цього користувача"
                            />
                        }
                    />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default UserCollections;
