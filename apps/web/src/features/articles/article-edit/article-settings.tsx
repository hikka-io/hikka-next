'use client';

import { FC } from 'react';

import { useArticleContext } from '@/services/providers/article-provider';

import CategorySelect from './components/article-settings/category-select';
import ContentInput from './components/article-settings/content-input';
import CreateActions from './components/article-settings/create-actions';
import EditActions from './components/article-settings/edit-actions';
import TagsInput from './components/article-settings/tags-input';
import TitleInput from './components/article-settings/title-input';

interface Props {}

const ArticleSettings: FC<Props> = () => {
    const slug = useArticleContext((state) => state.slug);

    return (
        <div className="flex h-full flex-col gap-6 p-4">
            <TitleInput />
            <ContentInput />
            <TagsInput />
            <CategorySelect />

            {!slug && <CreateActions />}
            {slug && <EditActions />}
        </div>
    );
};

export default ArticleSettings;
