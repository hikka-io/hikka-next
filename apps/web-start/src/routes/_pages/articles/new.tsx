import { createFileRoute } from '@tanstack/react-router';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';

import {
    ArticleSettings,
    ArticleEditDocument as ArticleText,
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
    return (
        <ArticleProvider>
            <div className="grid grid-cols-1 justify-center md:grid-cols-[1fr_30%] md:items-start md:justify-between md:gap-12 lg:grid-cols-[1fr_25%]">
                <Block>
                    <ArticleTitle />
                    <Card className="flex w-full p-0 md:hidden bg-secondary/20 backdrop-blur">
                        <ArticleSettings />
                    </Card>
                    <ArticleText />
                </Block>
                <Card className="bg-secondary/20 sticky top-20 order-1 hidden w-full self-start p-0 backdrop-blur-xl md:flex">
                    <ArticleSettings />
                </Card>
            </div>
        </ArticleProvider>
    );
}
