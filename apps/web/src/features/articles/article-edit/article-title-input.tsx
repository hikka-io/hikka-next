import type { FC } from 'react';

import { API_LIMITS } from '@hikka/api';

import { deselectBlocks } from '@/components/plate/editor/transforms';

import { useArticleContext } from './article-provider';

const ArticleTitleInput: FC = () => {
    const title = useArticleContext((state) => state.title);
    const setTitle = useArticleContext((state) => state.setTitle);
    const editor = useArticleContext((state) => state.editor);

    return (
        <textarea
            aria-label="Назва статті"
            placeholder="Назва статті"
            rows={1}
            maxLength={API_LIMITS.articleTitle.max}
            value={title ?? ''}
            onChange={(e) => setTitle(e.target.value.replace(/\n/g, ' '))}
            // Selected blocks keep the editor from taking focus, and look stale once typing moves here.
            onFocus={() => editor && deselectBlocks(editor)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') e.preventDefault();
                if (e.key === 'Tab' && !e.shiftKey && editor) {
                    e.preventDefault();
                    editor.tf.focus({ edge: 'start' });
                }
            }}
            className="field-sizing-content w-full resize-none overflow-hidden bg-transparent font-bold text-2xl leading-8 outline-none placeholder:text-muted-foreground/60"
        />
    );
};

export default ArticleTitleInput;
