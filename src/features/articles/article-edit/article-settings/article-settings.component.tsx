'use client';

import { FC } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';

import { useArticleContext } from '@/services/providers/article-provider';

import CategorySelect from './category-select';
import ContentInput from './content-input';
import CreateActions from './create-actions';
import EditActions from './edit-actions';
import TagsInput from './tags-input';
import TitleInput from './title-input';

interface Props {}

const ArticleSettings: FC<Props> = () => {
    const slug = useArticleContext((state) => state.slug);

    return (
        <ScrollArea className="flex flex-col items-start gap-8 lg:max-h-[calc(100vh-6rem)]">
            <div className="flex h-full flex-col gap-6 p-4">
                <TitleInput />
                <ContentInput />
                <TagsInput />
                <CategorySelect />

                {!slug && <CreateActions />}
                {slug && <EditActions />}
            </div>
        </ScrollArea>
    );
};

export default ArticleSettings;
