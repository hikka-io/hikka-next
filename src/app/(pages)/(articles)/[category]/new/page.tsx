import Block from '@/components/ui/block';
import Card from '@/components/ui/card';

import ArticleCover from '@/features/articles/article-edit/article-cover.component';
import ArticleSettings from '@/features/articles/article-edit/article-settings/article-settings.component';
import ArticleText from '@/features/articles/article-edit/article-text.component';
import ArticleTitle from '@/features/articles/article-edit/article-title.component';

import ArticleProvider from '@/services/providers/article-provider';

const ArticleNewPage = async (props: {
    params: Promise<Record<string, any>>;
}) => {
    const params = await props.params;

    const { category } = params;

    return (
        <ArticleProvider initialState={{ category }}>
            <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                <Block>
                    <ArticleTitle />
                    <ArticleCover />
                    <ArticleText />
                </Block>
                <Card className="sticky top-20 order-1 hidden w-full p-0 lg:order-2 lg:block">
                    <ArticleSettings />
                </Card>
            </div>
        </ArticleProvider>
    );
};

export default ArticleNewPage;
