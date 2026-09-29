import { memo } from 'react';

import { ArticlePlateEditor } from '@/components/plate/editor/plate-editor';
import { hasPlateContent } from '@/components/plate/editor/value/has-content';
import { Label } from '@/components/ui/label';
import { usePreventUnsavedClose } from '@/services/hooks/use-prevent-unsaved-close';

import { useArticleContext } from './article-provider';

const ArticleEditDocument = () => {
    const document = useArticleContext((state) => state.document);
    const title = useArticleContext((state) => state.title);
    const setDocument = useArticleContext((state) => state.setDocument);

    const hasTitle = Boolean(title && title.trim().length > 0);
    const hasDocumentContent = hasPlateContent(document);
    const hasUnsavedContent = hasTitle || hasDocumentContent;

    usePreventUnsavedClose(hasUnsavedContent);

    return (
        <div className="flex flex-col gap-4">
            <Label>Зміст</Label>
            <ArticlePlateEditor
                editorId="article-editor"
                value={document}
                onValueChange={setDocument}
                className="min-h-44"
                placeholder="Напишіть зміст статті..."
                modalDescription={title}
            />
        </div>
    );
};

export default memo(ArticleEditDocument);
