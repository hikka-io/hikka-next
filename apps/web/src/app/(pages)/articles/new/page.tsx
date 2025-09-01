import Block from '@/components/ui/block';
import Card from '@/components/ui/card';

import ArticleText from '@/features/articles/article-edit/article-document';
import ArticlePreview from '@/features/articles/article-edit/article-preview';
import ArticleSettings from '@/features/articles/article-edit/article-settings/article-settings';
import ArticleTitle from '@/features/articles/article-edit/article-title';

import ArticleProvider from '@/services/providers/article-provider';

const ArticleNewPage = async (props: {
    params: Promise<Record<string, any>>;
}) => {
    return (
        <ArticleProvider>
            <div className="grid grid-cols-1 justify-center md:grid-cols-[1fr_30%] md:items-start md:justify-between md:gap-16 lg:grid-cols-[1fr_25%]">
                <Block>
                    <ArticleTitle />
                    <Card className="flex w-full p-0 md:hidden">
                        <ArticleSettings />
                    </Card>
                    <ArticlePreview />
                    <ArticleText />
                </Block>
                <Card className="sticky top-20 order-1 hidden w-full self-start p-0 md:flex">
                    <ArticleSettings />
                </Card>
            </div>
        </ArticleProvider>
    );
};

export default ArticleNewPage;
