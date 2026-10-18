import type { FC } from 'react';

import { API_LIMITS } from '@hikka/api';

import { useArticleContext } from './article-provider';

const ArticleTitleInput: FC = () => {
    const title = useArticleContext((state) => state.title);
    const setTitle = useArticleContext((state) => state.setTitle);

    return (
        <textarea
            aria-label="Назва статті"
            placeholder="Назва статті"
            rows={1}
            maxLength={API_LIMITS.articleTitle.max}
            value={title ?? ''}
            onChange={(e) => setTitle(e.target.value.replace(/\n/g, ' '))}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
            className="field-sizing-content w-full resize-none overflow-hidden bg-transparent font-bold text-2xl leading-8 outline-none placeholder:text-muted-foreground/60"
        />
    );
};

export default ArticleTitleInput;
