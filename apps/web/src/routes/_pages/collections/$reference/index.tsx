import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum, getCollectionOptions } from '@hikka/api';

import Block from '@/components/ui/block';
import Link from '@/components/ui/link';
import Breadcrumbs from '@/features/app-shell/nav-breadcrumbs';
import {
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

    return (
        <CollectionProvider
            initialState={collection as Partial<CollectionState>}
        >
            <Breadcrumbs>
                <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                    <Link
                        to={`/collections/${reference}`}
                        className="flex-1 overflow-hidden text-ellipsis font-bold text-sm hover:underline"
                    >
                        {collection?.title}
                    </Link>
                </div>
            </Breadcrumbs>
            <div className="flex flex-col gap-12">
                <div className="mx-auto w-full max-w-3xl p-0">
                    <CollectionAuthor />
                </div>
                <div className="grid grid-cols-1 justify-items-center gap-12 lg:grid-cols-[auto_1fr_auto] lg:gap-4">
                    <div className="hidden min-w-52 max-w-56 lg:block" />
                    <Block className="max-w-3xl">
                        <CollectionTitle />
                        <CollectionGroups />
                    </Block>
                    <div className="hidden min-w-52 max-w-56 lg:block">
                        <div className="sticky top-20 h-[calc(100vh-5rem)]">
                            <TableOfContents className="max-h-[70vh] bg-secondary/20 opacity-60 backdrop-blur-xl transition-opacity hover:opacity-100" />
                        </div>
                    </div>
                </div>
                <div className="mx-auto w-full max-w-3xl p-0">
                    <Comments
                        preview
                        slug={reference}
                        content_type={ContentTypeEnum.COLLECTION}
                    />
                </div>
                <CollectionNavbar />
            </div>
        </CollectionProvider>
    );
}
