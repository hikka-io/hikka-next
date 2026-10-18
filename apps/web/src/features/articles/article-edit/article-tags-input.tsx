import { type FC, type KeyboardEvent, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { API_LIMITS, getArticleTopOptions } from '@hikka/api';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsCloseRounded from '@/components/icons/material-symbols/MaterialSymbolsCloseRounded';
import {
    Autocomplete,
    AutocompleteContent,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteLabel,
    AutocompleteList,
} from '@/components/ui/autocomplete';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { TAG_FORMS } from '@/utils/i18n/word-forms';

import { useArticleContext } from './article-provider';
import {
    ARTICLE_TAG_LENGTH,
    isValidArticleTag,
    normalizeArticleTag,
} from './article-tags';

const COMMIT_KEYS = new Set(['Enter', ',', ' ']);

const ArticleTagsInput: FC = () => {
    const tags = useArticleContext((state) => state.tags);
    const setTags = useArticleContext((state) => state.setTags);

    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState('');

    const { data: top } = useQuery({
        ...getArticleTopOptions(),
        enabled: editing,
    });

    const left = API_LIMITS.tags.max - tags.length;
    const normalized = normalizeArticleTag(draft);
    const invalid = normalized.length > 0 && !isValidArticleTag(normalized);
    const duplicate = tags.includes(normalized);
    const hint = duplicate
        ? 'Цей тег уже додано'
        : invalid
          ? `Від ${ARTICLE_TAG_LENGTH.min} до ${ARTICLE_TAG_LENGTH.max} літер, без цифр і пробілів`
          : `Можна додати ще ${left} ${getDeclensionWord(left, TAG_FORMS)}`;
    const suggestions = (top?.tags ?? [])
        .map((tag) => tag.name)
        .filter((name) => !tags.includes(name));

    const close = () => {
        setDraft('');
        setEditing(false);
    };

    const add = (tag: string) => {
        if (!isValidArticleTag(tag) || tags.includes(tag)) return;

        setTags([...tags, tag]);
        setDraft('');

        if (left <= 1) setEditing(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        // A highlighted suggestion is Autocomplete's to pick.
        if (e.currentTarget.getAttribute('aria-activedescendant')) return;

        if (COMMIT_KEYS.has(e.key)) {
            e.preventDefault();
            add(normalized);
        } else if (e.key === 'Backspace' && !draft && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                        type="button"
                        aria-label={`Прибрати тег ${tag}`}
                        className="-mr-1 text-muted-foreground hover:text-foreground"
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                    >
                        <MaterialSymbolsCloseRounded />
                    </button>
                </Badge>
            ))}

            {left > 0 && !editing && (
                <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className={cn(
                        badgeVariants({ variant: 'outline' }),
                        'cursor-pointer text-muted-foreground hover:bg-accent hover:text-foreground',
                    )}
                >
                    <MaterialSymbolsAddRounded />
                    Тег
                </button>
            )}

            {editing && (
                <Autocomplete
                    open
                    items={suggestions}
                    value={draft}
                    onValueChange={(value, details) =>
                        details.reason === 'item-press'
                            ? add(value)
                            : setDraft(value)
                    }
                    onOpenChange={(open, details) =>
                        !open && details.reason === 'escape-key' && close()
                    }
                >
                    <AutocompleteInput
                        autoFocus
                        aria-label="Новий тег"
                        aria-invalid={invalid || duplicate}
                        maxLength={ARTICLE_TAG_LENGTH.max}
                        onKeyDown={handleKeyDown}
                        onBlur={close}
                        className={cn(
                            badgeVariants({ variant: 'outline' }),
                            'w-32 border-input bg-transparent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                        )}
                    />
                    <AutocompleteContent>
                        <AutocompleteLabel>{hint}</AutocompleteLabel>
                        <AutocompleteList>
                            {(tag: string) => (
                                <AutocompleteItem key={tag} value={tag}>
                                    {tag}
                                </AutocompleteItem>
                            )}
                        </AutocompleteList>
                    </AutocompleteContent>
                </Autocomplete>
            )}
        </div>
    );
};

export default ArticleTagsInput;
