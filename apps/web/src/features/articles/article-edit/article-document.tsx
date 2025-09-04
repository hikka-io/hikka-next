'use client';

import { memo } from 'react';

import { ArticlePlateEditor } from '@/components/plate/editor/plate-editor';
import { Label } from '@/components/ui/label';

import { useArticleContext } from '@/services/providers/article-provider';

const ArticleDocument = () => {
    const document = useArticleContext((state) => state.document);
    const setDocument = useArticleContext((state) => state.setDocument);

    return (
        <div className="flex flex-col gap-4">
            <Label>Зміст</Label>
            <ArticlePlateEditor
                value={document}
                onValueChange={setDocument}
                className="min-h-44"
                placeholder="Напишіть зміст статті..."
            />
        </div>
    );
};

export default memo(ArticleDocument);
