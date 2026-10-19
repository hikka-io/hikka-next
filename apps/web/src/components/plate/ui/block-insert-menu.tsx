import { PlusIcon } from 'lucide-react';
import { KEYS, NodeApi, PathApi, type TElement } from 'platejs';
import type { PlateEditor } from 'platejs/react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger } from '@/components/ui/popover';

import { BlockCommandContent } from './block-command-content';
import {
    BLOCK_MENU_GROUPS,
    useDisabledInsertTypes,
} from './insert-block-items';

type Props = {
    editor: PlateEditor;
    element: TElement;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const isEmptyParagraph = (element: TElement) =>
    element.type === KEYS.p &&
    element.children.length === 1 &&
    NodeApi.string(element) === '';

/** Puts the caret where the chosen block goes: this empty line, or a new one below. */
function prepareTarget(editor: PlateEditor, element: TElement) {
    const path = editor.api.findPath(element);
    if (!path) return;

    if (isEmptyParagraph(element)) {
        editor.tf.select(editor.api.start(path));
        return;
    }

    const next = PathApi.next(path);
    editor.tf.insertNodes(editor.api.create.block(), { at: next });
    editor.tf.select(editor.api.start(next));
}

/** The gutter "+": a block picker with its own filter field, like the `/` menu. */
export function BlockInsertMenu({
    editor,
    element,
    open,
    onOpenChange,
}: Props) {
    const disabledTypes = useDisabledInsertTypes();

    return (
        <Popover
            open={open}
            onOpenChange={(next) => {
                if (next) prepareTarget(editor, element);
                onOpenChange(next);
            }}
        >
            <PopoverTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Додати блок"
                        className="text-muted-foreground"
                    />
                }
            >
                <PlusIcon />
            </PopoverTrigger>
            <BlockCommandContent
                placeholder="Пошук блоку…"
                groups={BLOCK_MENU_GROUPS.map(({ group, items }) => ({
                    group,
                    items: items
                        .filter(({ value }) => !disabledTypes.has(value))
                        .map(({ icon, label, value, onSelect }) => ({
                            icon,
                            label: label ?? value,
                            value,
                            onSelect: () => {
                                onOpenChange(false);
                                onSelect(editor, value);
                                editor.tf.focus();
                            },
                        })),
                }))}
            />
        </Popover>
    );
}
