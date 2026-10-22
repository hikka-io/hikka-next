import {
    type ComponentProps,
    type FC,
    type RefObject,
    useEffect,
    useRef,
    useState,
} from 'react';

import { useQuery } from '@tanstack/react-query';

import {
    type CollectionContentTypeEnum,
    ContentTypeEnum,
    getCollectionOptions,
} from '@hikka/api';
import { CONTENT_TYPE_LINKS, contentPath, newId } from '@hikka/core';

import RulesAlert from '@/components/rules-alert';
import UnsavedChangesDialog from '@/components/unsaved-changes-dialog';
import { usePageHeader } from '@/features/app-shell';
import { usePreventUnsavedClose } from '@/services/hooks/use-prevent-unsaved-close';
import { useSession } from '@/services/session';
import { contentInfoOptions } from '@/utils/api/content-queries';

import CollectionDescription from './collection-edit/collection-description';
import CollectionEditorAuthor from './collection-edit/collection-editor-author';
import CollectionProvider, {
    CollectionContext,
    useCollectionContext,
    useCollectionStore,
} from './collection-edit/collection-provider';
import {
    type CollectionState,
    collectionState,
    type Item,
} from './collection-edit/collection-store';
import CollectionEditTitle from './collection-edit/collection-title';
import CollectionEditGroups from './collection-edit/groups/collection-groups';
import HeaderActions from './collection-edit/publish/header-actions';
import PublishCard from './collection-edit/publish/publish-card';
import PublishDrawer from './collection-edit/publish/publish-drawer';
import {
    type CollectionSave,
    describeSave,
    selectUnsavedBlocking,
    useCollectionSave,
} from './collection-edit/use-collection-save';

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

type UpdateProps = {
    reference: string;
};

type LayoutProps = {
    title: string;
    parent: string;
    author?: ComponentProps<typeof CollectionEditorAuthor>['author'];
};

type HeaderControls = {
    save: CollectionSave['save'];
    openSettings: () => void;
};

type RulesProps = {
    className?: string;
};

const CollectionRules: FC<RulesProps> = ({ className }) => (
    <RulesAlert
        rulesFile="COLLECTION_RULES.md"
        before="Перш ніж створювати колекції, рекомендуємо ознайомитись з"
        after="створення колекцій."
        modalTitle="Правила колекцій"
        className={className}
    />
);

// The mobile header renders outside the provider and keeps the slot it gets,
// so the slot is created once and reaches the page through the store and a ref.
function createHeaderActions(
    store: ReturnType<typeof useCollectionStore>,
    controls: RefObject<HeaderControls>,
) {
    return function CollectionHeaderActions() {
        return (
            <CollectionContext.Provider value={store}>
                <HeaderActions
                    save={() => controls.current.save()}
                    onOpenSettings={() => controls.current.openSettings()}
                />
            </CollectionContext.Provider>
        );
    };
}

const CollectionEditorLayout: FC<LayoutProps> = ({ title, parent, author }) => {
    const store = useCollectionStore();
    const save = useCollectionSave();
    const [settingsOpen, setSettingsOpen] = useState(false);

    const status = useCollectionContext((state) => describeSave(state).label);
    const blocking = useCollectionContext(selectUnsavedBlocking);
    const blocker = usePreventUnsavedClose(blocking, { navigation: true });

    const controls = useRef<HeaderControls>({
        save: save.save,
        openSettings: () => setSettingsOpen(true),
    });

    useEffect(() => {
        controls.current.save = save.save;
    });

    const [actionsComponent] = useState(() =>
        createHeaderActions(store, controls),
    );

    usePageHeader({ title, subtitle: status, parent, actionsComponent });

    return (
        <>
            <div className="mx-auto grid w-full max-w-[75rem] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,52rem)_20rem] lg:items-start lg:justify-center">
                <div className="flex min-w-0 flex-col gap-8">
                    <CollectionRules className="md:hidden" />
                    {author && <CollectionEditorAuthor author={author} />}
                    <CollectionEditTitle />
                    <CollectionDescription />
                    <CollectionEditGroups />
                </div>
                <aside className="hidden flex-col gap-4 md:flex lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto">
                    <PublishCard save={save} />
                    <CollectionRules />
                </aside>
            </div>
            <PublishDrawer
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                save={save}
            />
            <UnsavedChangesDialog blocker={blocker} />
        </>
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
    const { user } = useSession();
    const content_type = initialContent?.content_type;
    const slug = initialContent?.slug;
    const prefilled = Boolean(content_type && slug);

    const { data: content, isPending } = useQuery({
        ...contentInfoOptions(content_type ?? 'anime', slug ?? ''),
        enabled: prefilled,
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
            <CollectionEditorLayout
                title="Нова колекція"
                parent={CONTENT_TYPE_LINKS.collection}
                author={user}
            />
        </CollectionProvider>
    );
};

const CollectionEditorUpdate: FC<UpdateProps> = ({ reference }) => {
    const { data: collection } = useQuery(
        getCollectionOptions({ path: { reference } }),
    );

    if (!collection) return null;

    return (
        <CollectionProvider
            key={reference}
            initialState={collectionState(collection)}
        >
            <CollectionEditorLayout
                title={collection.title}
                parent={contentPath(ContentTypeEnum.COLLECTION, reference)}
                author={collection.author}
            />
        </CollectionProvider>
    );
};

const CollectionEditorPage: FC<Props> = ({ reference, initialContent }) =>
    reference === undefined ? (
        <CollectionEditorNew initialContent={initialContent} />
    ) : (
        <CollectionEditorUpdate reference={reference} />
    );

export default CollectionEditorPage;
