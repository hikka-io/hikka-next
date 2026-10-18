import { type FC, useState } from 'react';

import { ArticleContentEnum } from '@hikka/api';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsCloseRounded from '@/components/icons/material-symbols/MaterialSymbolsCloseRounded';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { SearchModal } from '@/features/search';
import { useTitle } from '@/services/session';

import ArticleContentChip from '../article-content-chip';
import type { ArticleContent } from '../types';
import { useArticleContext } from './article-provider';

const ALLOWED_TYPES = [
    ArticleContentEnum.ANIME,
    ArticleContentEnum.MANGA,
    ArticleContentEnum.NOVEL,
];

const ArticleContentPicker: FC = () => {
    const content = useArticleContext((state) => state.content);
    const setContent = useArticleContext((state) => state.setContent);
    const title = useTitle(content);
    const [open, setOpen] = useState(false);

    return (
        <div className="flex items-center gap-1">
            {content ? (
                <>
                    <ArticleContentChip
                        content={content}
                        aria-label={`Змінити тайтл: ${title}`}
                        onClick={() => setOpen(true)}
                    />
                    <Button
                        size="icon-xs"
                        variant="ghost"
                        aria-label="Відв'язати тайтл"
                        onClick={() => setContent(null)}
                    >
                        <MaterialSymbolsCloseRounded />
                    </Button>
                </>
            ) : (
                <Chip
                    onClick={() => setOpen(true)}
                    className="bg-secondary/40 hover:bg-accent"
                >
                    <MaterialSymbolsAddRounded className="size-4" />
                    <span className="text-muted-foreground">
                        Прив'язати тайтл
                    </span>
                </Chip>
            )}
            <SearchModal
                open={open}
                onOpenChange={setOpen}
                allowedTypes={ALLOWED_TYPES}
                onClick={(value) => setContent(value as ArticleContent)}
                type="button"
            />
        </div>
    );
};

export default ArticleContentPicker;
