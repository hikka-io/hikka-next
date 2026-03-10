import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';
import Link from '@/components/ui/link';

import Breadcrumbs from '@/features/common/nav-breadcrumbs';
import Block from '@/components/ui/block';
import {
    CollectionViewAuthor as CollectionAuthor,
    CollectionViewGroups as CollectionGroups,
    CollectionViewNavbar as CollectionNavbar,
    CollectionViewTitle as CollectionTitle,
    TableOfContents,
} from '@/features/collections';
import { CommentList as Comments } from '@/features/comments';
import CollectionProvider from '@/services/providers/collection-provider';

export const Route = createFileRoute('/_pages/collections/$reference/')({
    component: CollectionPage,
});

function CollectionPage() {
    const { reference } = Route.useParams();
    const { collection } = Route.useRouteContext() as any;

    return (
        <CollectionProvider initialState={collection}>
            <Breadcrumbs>
                <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                    <Link
                        href={'/collections/' + reference}
                        className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
                    >
                        {collection?.title}
                    </Link>
                </div>
            </Breadcrumbs>
            <div className="flex flex-col gap-12">
                <div className="w-full mx-auto max-w-3xl p-0">
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
                <div className="w-full mx-auto max-w-3xl p-0">
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
