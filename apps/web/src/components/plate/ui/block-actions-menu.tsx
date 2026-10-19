import type { Ref } from 'react';

import { BlockSelectionPlugin } from '@platejs/selection/react';
import { GripVertical, Trash2Icon } from 'lucide-react';
import type { Path, TElement } from 'platejs';
import type { PlateEditor } from 'platejs/react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger } from '@/components/ui/popover';

import { canTurnInto, turnBlockInto } from '../editor/transforms';
import { BlockCommandContent } from './block-command-content';
import { ARTICLE_INSERT_GROUPS } from './insert-block-items';

type Props = {
    editor: PlateEditor;
    element: TElement;
    handleRef: Ref<HTMLButtonElement>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const TURN_INTO_ITEMS = ARTICLE_INSERT_GROUPS.flatMap(({ items }) => items);

/** Moves the selection off the text and onto whole blocks, as Notion does when a block's handle is used. */
function selectBlock(editor: PlateEditor, id: unknown) {
    const { blockSelection } = editor.getApi(BlockSelectionPlugin);

    editor.tf.blur();
    editor.tf.deselect();
    if (typeof id === 'string') blockSelection.set(id);
}

const selectBlockAt = (editor: PlateEditor, path: Path) =>
    selectBlock(editor, editor.api.node<TElement>(path)?.[0].id);

/** The drag handle: drag to move the block, click for a menu to turn it into another kind or delete it. */
export function BlockActionsMenu({
    editor,
    element,
    handleRef,
    open,
    onOpenChange,
}: Props) {
    // Keyboard focus stays on the selected blocks, so Backspace or another arrow key acts on them.
    const focusSelection = () =>
        editor.getApi(BlockSelectionPlugin).blockSelection.focus();

    const run = (action: (path: Path) => void) => {
        onOpenChange(false);

        const path = editor.api.findPath(element);
        if (path) action(path);
        focusSelection();
    };

    return (
        <Popover
            open={open}
            onOpenChange={(next) => {
                if (next) selectBlock(editor, element.id);
                onOpenChange(next);
            }}
        >
            <PopoverTrigger
                render={
                    <Button
                        ref={handleRef}
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Дії з блоком"
                        className="cursor-grab text-muted-foreground active:cursor-grabbing"
                        data-plate-prevent-deselect
                    />
                }
            >
                <GripVertical />
            </PopoverTrigger>
            <BlockCommandContent
                placeholder="Пошук дії…"
                finalFocus={(closeType) => {
                    if (closeType === 'keyboard') focusSelection();
                    return false;
                }}
                groups={[
                    {
                        group: 'Перетворити на',
                        items: TURN_INTO_ITEMS.filter(({ value }) =>
                            canTurnInto(element, value),
                        ).map(({ icon, label, value }) => ({
                            icon,
                            label: label ?? value,
                            value,
                            checked: element.type === value,
                            onSelect: () =>
                                run((path) => {
                                    turnBlockInto(editor, path, value);
                                    selectBlockAt(editor, path);
                                }),
                        })),
                    },
                    {
                        group: 'Дії',
                        items: [
                            {
                                icon: <Trash2Icon />,
                                label: 'Видалити',
                                value: 'delete',
                                onSelect: () =>
                                    run((path) =>
                                        editor.tf.removeNodes({ at: path }),
                                    ),
                            },
                        ],
                    },
                ]}
            />
        </Popover>
    );
}
