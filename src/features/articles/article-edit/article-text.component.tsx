'use client';

import { memo } from 'react';

import BasicEditor from '@/components/markdown/editor/basic-editor';
import { Label } from '@/components/ui/label';

import { useArticleContext } from '@/services/providers/article-provider';

const ArticleText = () => {
    const text = useArticleContext((state) => state.text);
    const setText = useArticleContext((state) => state.setText);

    return (
        <div className="flex flex-col gap-4">
            <Label>Зміст</Label>
            <BasicEditor
                initialValue={text}
                onValueChange={setText}
                className="min-h-44"
                placeholder="Напишіть зміст статті..."
            />
        </div>
    );
};

export default memo(ArticleText);
