import { memo, useState } from 'react';

import { ArticlePlateEditor } from '@/components/plate/editor/article-editor';

import { useArticleContext, useArticleStoreApi } from './article-provider';

const ArticleEditDocument = () => {
    const store = useArticleStoreApi();
    // The editor only reads its starting value, so edits need not re-render it.
    const [value] = useState(() => store.getState().document);
    const setDocument = useArticleContext((state) => state.setDocument);
    const setEditorDocument = useArticleContext(
        (state) => state.setEditorDocument,
    );

    return (
        <ArticlePlateEditor
            editorId="article-editor"
            value={value}
            onValueChange={setDocument}
            onReady={(editor) => setEditorDocument(editor.children, editor)}
        />
    );
};

export default memo(ArticleEditDocument);
