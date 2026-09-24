import { type FC, type KeyboardEvent, useState } from 'react';

import { StickyNote } from 'lucide-react';

import { MaterialSymbolsAddRounded } from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { MaterialSymbolsCheckRounded } from '@/components/icons/material-symbols/MaterialSymbolsCheckRounded';
import MaterialSymbolsCloseRounded from '@/components/icons/material-symbols/MaterialSymbolsCloseRounded';
import { MaterialSymbolsEditRounded } from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import MDViewer from '@/components/markdown/viewer/md-viewer';
import TextExpand from '@/components/text-expand';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

const MAX_LENGTH = 2048;
const COUNTER_THRESHOLD = MAX_LENGTH - 200;

const placeCaretAtEnd = (el: HTMLTextAreaElement | null) =>
    el?.setSelectionRange(el.value.length, el.value.length);

type Props = {
    note?: string | null;
    isSaving: boolean;
    onSave: (note: string, options: { onSuccess?: () => void }) => void;
};

const UserNote: FC<Props> = ({ note, isSaving, onSave }) => {
    const [draft, setDraft] = useState<string | null>(null);

    const isEditing = draft !== null;
    const hasNote = !!note?.trim();

    const startEditing = () => setDraft(note ?? '');
    const cancel = () => setDraft(null);
    const save = () => {
        if (draft === null || isSaving) return;

        if (draft.trim() === (note ?? '').trim()) {
            cancel();
            return;
        }

        onSave(draft, { onSuccess: () => setDraft(null) });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            cancel();
        }

        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            save();
        }
    };

    if (isEditing) {
        return (
            <div className="flex flex-col gap-3 p-4">
                <Textarea
                    ref={placeCaretAtEnd}
                    autoFocus
                    aria-label="Нотатка"
                    className="field-sizing-content max-h-72 min-h-24 resize-none"
                    maxLength={MAX_LENGTH}
                    placeholder="Враження, улюблені моменти або на чому зупинились"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                {draft.length >= COUNTER_THRESHOLD && (
                    <span className="text-right text-muted-foreground text-xs tabular-nums">
                        {draft.length}/{MAX_LENGTH}
                    </span>
                )}
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="icon-md"
                        onClick={cancel}
                        disabled={isSaving}
                        aria-label="Скасувати"
                    >
                        <MaterialSymbolsCloseRounded />
                    </Button>
                    <Button
                        size="md"
                        className="flex-1"
                        onClick={save}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <Spinner />
                        ) : (
                            <MaterialSymbolsCheckRounded />
                        )}
                        Зберегти
                    </Button>
                </div>
            </div>
        );
    }

    if (!hasNote) {
        return (
            <button
                type="button"
                onClick={startEditing}
                className="flex w-full items-center gap-2 p-4 text-left text-muted-foreground text-sm transition-colors hover:bg-secondary/50 hover:text-foreground"
            >
                <StickyNote className="size-4" />
                <span className="flex-1">Додати нотатку</span>
                <MaterialSymbolsAddRounded className="size-4" />
            </button>
        );
    }

    return (
        <div className="flex flex-col gap-2 p-4">
            <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-muted-foreground text-sm">
                    <StickyNote className="size-4" />
                    Нотатка
                </p>
                <Button
                    variant="secondary"
                    size="icon-sm"
                    onClick={startEditing}
                    aria-label="Редагувати нотатку"
                >
                    <MaterialSymbolsEditRounded />
                </Button>
            </div>
            <TextExpand maxHeight={96}>
                <MDViewer className="text-sm">{note}</MDViewer>
            </TextExpand>
        </div>
    );
};

export default UserNote;
