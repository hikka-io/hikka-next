import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
    type CollectionContentTypeEnum,
    getCollectionOptions,
} from '@hikka/api';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { usePageHeader } from '@/features/app-shell';
import { contentInfoOptions } from '@/utils/api/content-queries';
import { newId } from '@/utils/new-id';

import CollectionEditGroups from './collection-edit/collection-groups';
import CollectionProvider from './collection-edit/collection-provider';
import CollectionEditSettings from './collection-edit/collection-settings';
import {
    type CollectionState,
    collectionState,
    type Item,
} from './collection-edit/collection-store';
import CollectionEditTitle from './collection-edit/collection-title';

type InitialContent = {
    content_type?: CollectionContentTypeEnum;
    slug?: string;
};

type Props = {
    reference?: string;
    initialContent?: InitialContent;
};

type NewProps = {
    initialContent?: InitialContent;
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

function stateWithItem(
    content_type: CollectionContentTypeEnum,
    content: Item['content'],
): Partial<CollectionState> {
    return {
        content_type,
        groups: [
            {
                id: newId(),
                title: null,
                items: [{ id: content.slug, content }],
            },
        ],
    };
}

const CollectionEditorNew: FC<NewProps> = ({ initialContent }) => {
    const content_type = initialContent?.content_type;
    const slug = initialContent?.slug;
    const prefilled = Boolean(content_type && slug);

    const { data: content, isPending } = useQuery({
        ...contentInfoOptions(content_type ?? 'anime', slug ?? ''),
        enabled: prefilled,
    });

    usePageHeader({
        title: 'Нова колекція',
        parent: '/collections',
    });

    if (prefilled && isPending) return null;

    return (
        <CollectionProvider
            key={content?.slug}
            initialState={
                content_type && content
                    ? stateWithItem(content_type, content as Item['content'])
                    : undefined
            }
        >
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

const CollectionEditorPage: FC<Props> = ({ reference, initialContent }) => {
    return reference === undefined ? (
        <CollectionEditorNew initialContent={initialContent} />
    ) : (
        <CollectionEditorUpdate reference={reference} />
    );
};

export default CollectionEditorPage;
