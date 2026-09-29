import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getCollectionOptions } from '@hikka/api';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { usePageHeader } from '@/features/app-shell';

import {
    CollectionEditGroups,
    CollectionEditSettings,
    CollectionEditTitle,
    CollectionProvider,
    type CollectionState,
} from './collection-edit';

type Props = {
    reference?: string;
};

type LayoutProps = {
    mode?: 'create' | 'edit';
};

type UpdateProps = {
    reference: string;
};

const CollectionEditorLayout: FC<LayoutProps> = ({ mode }) => {
    return (
        <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-x-10">
            <Block>
                <CollectionEditTitle />
                <Card className="-mx-4 block w-auto rounded-none border-x-0 p-0 lg:hidden">
                    <CollectionEditSettings mode={mode} />
                </Card>
                <CollectionEditGroups mode={mode} />
            </Block>
            <Card className="sticky top-20 order-1 hidden w-full p-0 lg:order-2 lg:block">
                <CollectionEditSettings mode={mode} />
            </Card>
        </div>
    );
};

const CollectionEditorNew: FC = () => {
    usePageHeader({
        title: 'Нова колекція',
        parent: '/collections',
    });

    return (
        <CollectionProvider>
            <CollectionEditorLayout />
        </CollectionProvider>
    );
};

const CollectionEditorUpdate: FC<UpdateProps> = ({ reference }) => {
    const { data: collection } = useQuery(
        getCollectionOptions({ path: { reference } }),
    );

    usePageHeader({
        title: collection?.title,
        subtitle: 'Редагування',
        parent: `/collections/${reference}`,
    });

    if (!collection) return null;

    return (
        <CollectionProvider
            initialState={collection as Partial<CollectionState>}
        >
            <div>
                <CollectionEditorLayout mode="edit" />
            </div>
        </CollectionProvider>
    );
};

const CollectionEditorPage: FC<Props> = ({ reference }) => {
    return reference === undefined ? (
        <CollectionEditorNew />
    ) : (
        <CollectionEditorUpdate reference={reference} />
    );
};

export default CollectionEditorPage;
