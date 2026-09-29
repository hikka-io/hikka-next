import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';
import type { Value } from 'platejs';

import { getArticleOptions } from '@hikka/api';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { usePageHeader } from '@/features/app-shell';
import { CONTENT_TYPE_LINKS } from '@/utils/content-paths';

import ArticleEditDocument from './article-edit/article-document';
import ArticleProvider from './article-edit/article-provider';
import ArticleEditSettings from './article-edit/article-settings';
import type { ArticleState } from './article-edit/article-store';
import ArticleEditTitle from './article-edit/article-title';

type Props = {
    slug?: string;
};

type UpdateProps = {
    slug: string;
};

const ArticleEditorLayout: FC = () => {
    return (
        <div className="grid grid-cols-1 justify-center md:grid-cols-[1fr_30%] md:items-start md:justify-between md:gap-x-10 lg:grid-cols-[1fr_25%]">
            <Block>
                <ArticleEditTitle />
                <Card className="-mx-4 flex w-auto rounded-none border-x-0 p-0 md:hidden">
                    <ArticleEditSettings />
                </Card>
                <ArticleEditDocument />
            </Block>
            <Card className="sticky top-20 order-1 hidden w-full self-start p-0 md:flex">
                <ArticleEditSettings />
            </Card>
        </div>
    );
};

const ArticleEditorNew: FC = () => {
    usePageHeader({ title: 'Нова стаття', parent: '/articles' });

    return (
        <ArticleProvider>
            <ArticleEditorLayout />
        </ArticleProvider>
    );
};

const ArticleEditorUpdate: FC<UpdateProps> = ({ slug }) => {
    const { data: article } = useQuery(getArticleOptions({ path: { slug } }));

    usePageHeader({
        title: article?.title,
        subtitle: article?.draft ? 'Чернетка' : 'Опубліковано',
        parent: `${CONTENT_TYPE_LINKS.article}/${slug}`,
    });

    if (!article) return null;

    return (
        <ArticleProvider
            initialState={
                {
                    ...article,
                    document: article.document as Value,
                    tags: article.tags.map((tag: { name: string }) => tag.name),
                } as Partial<ArticleState>
            }
        >
            <ArticleEditorLayout />
        </ArticleProvider>
    );
};

const ArticleEditorPage: FC<Props> = ({ slug }) => {
    return slug === undefined ? (
        <ArticleEditorNew />
    ) : (
        <ArticleEditorUpdate slug={slug} />
    );
};

export default ArticleEditorPage;
