import { type FC, type KeyboardEvent, useState } from 'react';

import { API_LIMITS } from '@hikka/api';
import {
    getDeclensionWord,
    isValidTag,
    normalizeTag,
    TAG_FORMS,
    TAG_LENGTH,
} from '@hikka/core';

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

const COMMIT_KEYS = new Set(['Enter', ',', ' ']);

type Props = {
    tags: string[];
    onChange: (tags: string[]) => void;
    suggestions?: string[];
    /** Fires when the input opens, so suggestions can load only once needed. */
    onEditStart?: () => void;
    className?: string;
};

/** Tags as removable badges plus a "Тег" chip that turns into an input. */
const TagsInput: FC<Props> = ({
    tags,
    onChange,
    suggestions = [],
    onEditStart,
    className,
}) => {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState('');

    const left = API_LIMITS.tags.max - tags.length;
    const normalized = normalizeTag(draft);
    const invalid = normalized.length > 0 && !isValidTag(normalized);
    const duplicate = tags.includes(normalized);
    const hint = duplicate
        ? 'Цей тег уже додано'
        : invalid
          ? `Від ${TAG_LENGTH.min} до ${TAG_LENGTH.max} літер, без цифр і пробілів`
          : `Можна додати ще ${left} ${getDeclensionWord(left, TAG_FORMS)}`;
    const items = suggestions.filter((name) => !tags.includes(name));

    const open = () => {
        setEditing(true);
        onEditStart?.();
    };

    const close = () => {
        setDraft('');
        setEditing(false);
    };

    const add = (tag: string) => {
        if (!isValidTag(tag) || tags.includes(tag)) return;

        onChange([...tags, tag]);
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
            onChange(tags.slice(0, -1));
        }
    };

    return (
        <div className={cn('flex flex-wrap items-center gap-2', className)}>
            {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                        type="button"
                        aria-label={`Прибрати тег ${tag}`}
                        className="-mr-1 text-muted-foreground hover:text-foreground"
                        onClick={() => onChange(tags.filter((t) => t !== tag))}
                    >
                        <MaterialSymbolsCloseRounded />
                    </button>
                </Badge>
            ))}

            {left > 0 && !editing && (
                <button
                    type="button"
                    onClick={open}
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
                    items={items}
                    value={draft}
                    onValueChange={(value, details) =>
                        details.reason === 'item-press'
                            ? add(value)
                            : setDraft(value)
                    }
                    onOpenChange={(next, details) =>
                        !next && details.reason === 'escape-key' && close()
                    }
                >
                    <AutocompleteInput
                        autoFocus
                        aria-label="Новий тег"
                        aria-invalid={invalid || duplicate}
                        maxLength={TAG_LENGTH.max}
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

export default TagsInput;
