import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum, getCollectionOptions } from '@hikka/api';

import Block from '@/components/ui/block';
import { usePageHeader } from '@/features/app-shell';
import {
    CollectionViewActionsMenu as CollectionActionsMenu,
    CollectionViewAuthor as CollectionAuthor,
    CollectionViewGroups as CollectionGroups,
    CollectionViewNavbar as CollectionNavbar,
    CollectionViewTitle as CollectionTitle,
    TableOfContents,
} from '@/features/collections';
import { CommentList as Comments } from '@/features/comments';
import CollectionProvider from '@/services/providers/collection-provider';
import type { CollectionState } from '@/services/stores/collection-store';

export const Route = createFileRoute('/_pages/collections/$reference/')({
    component: CollectionPage,
});

function CollectionPage() {
    const { reference } = Route.useParams();
    const { data: collection } = useQuery(
        getCollectionOptions({ path: { reference } }),
    );

    usePageHeader({
        title: collection?.title,
        subtitle: collection?.author.username,
        parent: '/collections',
        anchored: true,
        actionsComponent: CollectionActionsMenu,
    });

    return (
        <CollectionProvider
            initialState={collection as Partial<CollectionState>}
        >
            <div className="mb-12 flex flex-col gap-12 lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-4">
                {/* left spacer balances the TOC column so the content stays centered */}
                <div className="hidden min-w-52 max-w-56 lg:block" />

                {/* central column — author, content and comments share one width */}
                <div className="mx-auto flex w-full max-w-[52rem] flex-col gap-12">
                    <CollectionAuthor />
                    <Block className="w-full">
                        <CollectionTitle />
                        <CollectionGroups />
                    </Block>
                    <Comments
                        preview
                        slug={reference}
                        content_type={ContentTypeEnum.COLLECTION}
                    />
                </div>

                {/* TOC sidebar (lg+); mobile uses the navbar popover */}
                <div className="hidden min-w-52 max-w-56 lg:block">
                    <div className="sticky top-20 h-[calc(100vh-5rem)]">
                        <TableOfContents className="max-h-[70vh] surface opacity-60 transition-opacity hover:opacity-100" />
                    </div>
                </div>
            </div>
            <CollectionNavbar />
        </CollectionProvider>
    );
}
