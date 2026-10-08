import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getCollectionOptions } from '@hikka/api';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { usePageHeader } from '@/features/app-shell';

import CollectionEditGroups from './collection-edit/collection-groups';
import CollectionProvider from './collection-edit/collection-provider';
import CollectionEditSettings from './collection-edit/collection-settings';
import { collectionState } from './collection-edit/collection-store';
import CollectionEditTitle from './collection-edit/collection-title';

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
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_25%] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-10">
            <Block>
                <CollectionEditTitle />
            </Block>
            <Card className="-mx-4 block w-auto rounded-none border-x-0 p-0 lg:sticky lg:top-20 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:w-full lg:rounded-lg lg:border-x">
                <CollectionEditSettings mode={mode} />
            </Card>
            <Block>
                <CollectionEditGroups />
            </Block>
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
            key={reference}
            initialState={collectionState(collection)}
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
