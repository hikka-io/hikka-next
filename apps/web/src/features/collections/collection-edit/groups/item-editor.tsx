import { type FC, useId, useState } from 'react';

import { API_LIMITS } from '@hikka/api';
import { getDeclensionWord, SYMBOL_FORMS } from '@hikka/core';

import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTitle } from '@/services/session';

import { useCollectionContext } from '../collection-provider';
import { isCommentTooShort } from '../collection-rules';
import { findItemGroup, type Item } from '../collection-store';

const COMMENT_MIN = API_LIMITS.collectionComment.min;

type ContentProps = {
    itemId: Item['id'];
    onDone: () => void;
};

const ItemEditorContent: FC<ContentProps> = ({ itemId, onDone }) => {
    const groups = useCollectionContext((state) => state.groups);
    const updateItemComment = useCollectionContext(
        (state) => state.updateItemComment,
    );
    const moveItemToGroup = useCollectionContext(
        (state) => state.moveItemToGroup,
    );
    const removeItem = useCollectionContext((state) => state.removeItem);
    const id = useId();

    const group = findItemGroup(groups, itemId);
    const item = group?.items.find((entry) => entry.id === itemId);
    const title = useTitle(item?.content);

    if (!group || !item) return null;

    const tooShort = isCommentTooShort(item.comment);
    const groupOptions = groups
        .filter((entry) => entry.title !== null)
        .map((entry) => ({
            value: entry.id,
            label: entry.title?.trim() || 'Група без назви',
        }));

    const moveTo = (groupId: string) => {
        const target = groups.find((entry) => entry.id === groupId);
        if (!target || target === group) return;

        moveItemToGroup(item.id, group.id, target.id, target.items.length);
    };

    return (
        <ResponsiveModalContent title={title} className="md:max-w-md">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor={`${id}-comment`}>Коментар</Label>
                    <Textarea
                        id={`${id}-comment`}
                        value={item.comment ?? ''}
                        placeholder="Чому цей тайтл у колекції?"
                        aria-invalid={tooShort}
                        onChange={(e) =>
                            updateItemComment(group.id, item.id, e.target.value)
                        }
                        className="min-h-24"
                    />
                    {tooShort && (
                        <p className="text-destructive-foreground text-xs">
                            Щонайменше {COMMENT_MIN}{' '}
                            {getDeclensionWord(COMMENT_MIN, SYMBOL_FORMS)}
                        </p>
                    )}
                </div>
                {groupOptions.length > 1 && (
                    <div className="flex flex-col gap-2">
                        <Label id={`${id}-group`}>Група</Label>
                        <Select
                            value={[group.id]}
                            options={groupOptions}
                            onValueChange={(value) => moveTo(value[0])}
                        >
                            <SelectTrigger
                                size="md"
                                aria-labelledby={`${id}-group`}
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectList>
                                    <SelectGroup>
                                        {groupOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectList>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
            <ResponsiveModalFooter className="flex-row">
                <Button
                    variant="destructive"
                    size="md"
                    className="flex-1 md:mr-auto md:flex-none"
                    onClick={() => {
                        removeItem(group.id, item.id);
                        onDone();
                    }}
                >
                    <MaterialSymbolsDeleteForeverRounded />
                    Прибрати
                </Button>
                <Button
                    size="md"
                    className="flex-1 md:flex-none"
                    onClick={onDone}
                >
                    Готово
                </Button>
            </ResponsiveModalFooter>
        </ResponsiveModalContent>
    );
};

/** The comment, group and removal of one title; edits apply as they are made. */
const ItemEditor: FC = () => {
    const itemId = useCollectionContext((state) => state.editingItemId);
    const openItem = useCollectionContext((state) => state.openItem);
    // Keeps the last title rendered while the modal animates out.
    const [shown, setShown] = useState(itemId);

    if (itemId !== undefined && itemId !== shown) setShown(itemId);

    const close = () => openItem(undefined);

    return (
        <ResponsiveModal
            open={itemId !== undefined}
            onOpenChange={(open) => !open && close()}
        >
            {shown !== undefined && (
                <ItemEditorContent itemId={shown} onDone={close} />
            )}
        </ResponsiveModal>
    );
};

export default ItemEditor;
