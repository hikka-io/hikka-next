'use client';

import { FC, Fragment } from 'react';

import { useArticleContext } from '@/services/providers/article-provider';

import CategorySelect from './components/category-select';
import ContentInput from './components/content-input';
import CreateActions from './components/create-actions';
import EditActions from './components/edit-actions';
import TagsInput from './components/tags-input';
import TitleInput from './components/title-input';

interface Props {}

const ArticleSettings: FC<Props> = () => {
    const slug = useArticleContext((state) => state.slug);

    return (
        <Fragment>
            <div className="flex h-full flex-col gap-6 p-4">
                <TitleInput />
                <ContentInput />
                <TagsInput />
                <CategorySelect />
            </div>
            <div className="bg-secondary/20 border-t p-4">
                {!slug && <CreateActions />}
                {slug && <EditActions />}
            </div>
        </Fragment>
    );
};

export default ArticleSettings;
