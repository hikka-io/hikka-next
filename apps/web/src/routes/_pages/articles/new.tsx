import { createFileRoute } from '@tanstack/react-router';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { usePageHeader } from '@/features/app-shell';
import {
    ArticleSettings,
    ArticleDocumentEditor as ArticleText,
    ArticleEditTitle as ArticleTitle,
} from '@/features/articles';
import ArticleProvider from '@/services/providers/article-provider';
import { requireAuth } from '@/utils/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/articles/new')({
    beforeLoad: async ({ context: { queryClient } }) => {
        requireAuth(queryClient);
    },
    head: () =>
        generateHeadMeta({
            title: 'Нова стаття',
            robots: { index: false },
        }),
    component: ArticleNewPage,
});

function ArticleNewPage() {
    usePageHeader({ title: 'Нова стаття', parent: '/articles' });

    return (
        <ArticleProvider>
            <div className="grid grid-cols-1 justify-center md:grid-cols-[1fr_30%] md:items-start md:justify-between md:gap-x-10 lg:grid-cols-[1fr_25%]">
                <Block>
                    <ArticleTitle />
                    <Card className="-mx-4 flex w-auto rounded-none border-x-0 p-0 md:hidden">
                        <ArticleSettings />
                    </Card>
                    <ArticleText />
                </Block>
                <Card className="sticky top-20 order-1 hidden w-full self-start p-0 md:flex">
                    <ArticleSettings />
                </Card>
            </div>
        </ArticleProvider>
    );
}
