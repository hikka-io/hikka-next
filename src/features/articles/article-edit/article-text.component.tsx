'use client';

import { memo } from 'react';

import PlateEditor from '@/components/markdown/editor/plate-editor';
import { Label } from '@/components/ui/label';

import { useArticleStore } from '@/services/stores/article-store';

const ArticleText = () => {
    const setText = useArticleStore((state) => state.setText);

    return (
        <div className="flex flex-col gap-4">
            <Label>Зміст</Label>
            <PlateEditor
                onValueChange={setText}
                className="min-h-44"
                placeholder="Напишіть зміст статті..."
            />
        </div>
    );
};

export default memo(ArticleText);
