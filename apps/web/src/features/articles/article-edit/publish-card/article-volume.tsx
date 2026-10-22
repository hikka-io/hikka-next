import { type FC, useId } from 'react';

import { TextCursorInput } from 'lucide-react';

import {
    formatNumber,
    getDeclensionWord,
    SYMBOL_FORMS,
    WORD_FORMS,
} from '@hikka/core';

import PanelSection from '@/components/panel-section';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/utils/cn';

import { ARTICLE_TEXT_MAX, documentFacts } from '../article-body';
import { useArticleContext } from '../article-provider';

const WORDS_PER_MINUTE = 200;

/** Share of the limit from which the counter warns. */
const NEAR_LIMIT = 0.9;

const ArticleVolume: FC = () => {
    const { characters, words } = useArticleContext((state) =>
        documentFacts(state.document),
    );
    const minutes = Math.ceil(words / WORDS_PER_MINUTE);
    const labelId = useId();

    const share = characters / ARTICLE_TEXT_MAX;
    const over = share > 1;
    const near = !over && share >= NEAR_LIMIT;

    return (
        <PanelSection icon={TextCursorInput} title="Обсяг" labelId={labelId}>
            <div className="flex items-baseline justify-between gap-2">
                <span
                    className={cn(
                        'font-medium text-sm tabular-nums',
                        near && 'text-warning-foreground',
                        over && 'text-destructive-foreground',
                    )}
                >
                    {formatNumber(characters)} /{' '}
                    {formatNumber(ARTICLE_TEXT_MAX)}{' '}
                    {getDeclensionWord(ARTICLE_TEXT_MAX, SYMBOL_FORMS)}
                </span>
                {words > 0 && (
                    <span className="flex gap-3 text-muted-foreground text-xs tabular-nums">
                        <span>
                            {words} {getDeclensionWord(words, WORD_FORMS)}
                        </span>
                        <span>≈ {minutes} хв</span>
                    </span>
                )}
            </div>
            <Progress
                value={Math.min(share, 1) * 100}
                aria-labelledby={labelId}
                className={cn(
                    'h-1.5 rounded-xs',
                    near &&
                        '[&_[data-slot=progress-indicator]]:bg-warning-foreground',
                    over &&
                        '[&_[data-slot=progress-indicator]]:bg-destructive-foreground',
                )}
            />
            {over && (
                <p className="text-destructive-foreground text-xs">
                    Скоротіть текст на{' '}
                    {formatNumber(characters - ARTICLE_TEXT_MAX)}{' '}
                    {getDeclensionWord(
                        characters - ARTICLE_TEXT_MAX,
                        SYMBOL_FORMS,
                    )}
                    , щоб зберегти статтю.
                </p>
            )}
        </PanelSection>
    );
};

export default ArticleVolume;
