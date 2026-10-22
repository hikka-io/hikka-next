import type { FC } from 'react';

import { API_LIMITS } from '@hikka/api';

import InlineTitleInput from '@/components/inline-title-input';
import { deselectBlocks } from '@/components/plate/editor/transforms';

import { useArticleContext } from './article-provider';

const ArticleTitleInput: FC = () => {
    const title = useArticleContext((state) => state.title);
    const setTitle = useArticleContext((state) => state.setTitle);
    const editor = useArticleContext((state) => state.editor);

    return (
        <InlineTitleInput
            placeholder="Назва статті"
            maxLength={API_LIMITS.articleTitle.max}
            value={title}
            onValueChange={setTitle}
            // Selected blocks keep the editor from taking focus, and look stale once typing moves here.
            onFocus={() => editor && deselectBlocks(editor)}
            onKeyDown={(e) => {
                if (e.key === 'Tab' && !e.shiftKey && editor) {
                    e.preventDefault();
                    editor.tf.focus({ edge: 'start' });
                }
            }}
        />
    );
};

export default ArticleTitleInput;
