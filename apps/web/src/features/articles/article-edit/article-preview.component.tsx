'use client';

import ArticleEditor from '@/components/markdown/editor/article-editor';
import { Label } from '@/components/ui/label';
import { useArticleContext } from '@/services/providers/article-provider';

const ArticlePreview = () => {
    const category = useArticleContext((state) => state.category);
    const preview = useArticleContext((state) => state.preview);
    const setPreview = useArticleContext((state) => state.setPreview);

    if (category === 'system') return null;

    return (
        <div className="flex flex-col gap-4">
            <Label>Попередній перегляд</Label>
            <ArticleEditor
                initialValue={preview}
                onValueChange={({ value }) => setPreview(value)}
                className="min-h-44"
                placeholder="Напишіть зміст попереднього перегляду..."
            />
        </div>
    );
};

export default ArticlePreview;
