import { useLayoutEffect, useState } from 'react';

import { useDraggable, useDropLine } from '@platejs/dnd';
import { BlockSelectionPlugin } from '@platejs/selection/react';
import { GripVertical } from 'lucide-react';
import {
    MemoizedChildren,
    type PlateElementProps,
    type RenderNodeWrapper,
    usePluginOption,
} from 'platejs/react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

import { BlockActionsMenu } from './block-actions-menu';
import { BlockInsertMenu } from './block-insert-menu';

const SELECTION_PADDING = 4;
const DROP_LINE_HEIGHT = 3;

/** Wraps every top-level block with Notion-like controls: "+" and a drag handle. */
export const BlockDraggable: RenderNodeWrapper = ({ editor, path }) => {
    if (editor.dom.readOnly || path.length !== 1) return;

    return (props) => <Draggable {...props} />;
};

function Draggable({ children, editor, element }: PlateElementProps) {
    const { isDragging, nodeRef, handleRef } = useDraggable({ element });
    const [openMenu, setOpenMenu] = useState<'insert' | 'actions'>();
    const [lineHeight, setLineHeight] = useState<number>();
    const [blockGap, setBlockGap] = useState(0);
    const selected = usePluginOption(
        BlockSelectionPlugin,
        'isSelected',
        element.id as string,
    );

    // Centres the controls on the block's first line and keeps the selection off its bottom margin.
    useLayoutEffect(() => {
        const block = nodeRef.current?.firstElementChild;
        if (!block || !element.type) return;

        const style = getComputedStyle(block);
        const height = Number.parseFloat(style.lineHeight);
        setLineHeight(Number.isNaN(height) ? undefined : height);
        setBlockGap(Number.parseFloat(style.marginBottom) || 0);
    }, [nodeRef, element.type]);

    return (
        <div className={cn('group/block relative', isDragging && 'opacity-50')}>
            <div
                contentEditable={false}
                data-open={!!openMenu}
                className="absolute top-0 -left-16 h-full w-16 select-none opacity-0 transition-opacity focus-within:opacity-100 group-hover/block:opacity-100 data-[open=true]:opacity-100"
            >
                <div
                    style={{ height: lineHeight }}
                    className="flex h-6 w-14 items-center justify-end gap-0.5"
                >
                    <BlockInsertMenu
                        editor={editor}
                        element={element}
                        open={openMenu === 'insert'}
                        onOpenChange={(open) =>
                            setOpenMenu(open ? 'insert' : undefined)
                        }
                    />
                    <BlockActionsMenu
                        editor={editor}
                        element={element}
                        handleRef={handleRef}
                        open={openMenu === 'actions'}
                        onOpenChange={(open) =>
                            setOpenMenu(open ? 'actions' : undefined)
                        }
                    />
                </div>
            </div>

            <div ref={nodeRef} className="relative flow-root">
                <MemoizedChildren>{children}</MemoizedChildren>
                {selected && (
                    <div
                        contentEditable={false}
                        style={{
                            top: -SELECTION_PADDING,
                            bottom: blockGap - SELECTION_PADDING,
                        }}
                        className="pointer-events-none absolute -inset-x-1.5 rounded-[min(var(--radius-sm),0.375rem)] bg-primary-foreground/10"
                    />
                )}
                <DropLine gap={blockGap} />
            </div>
        </div>
    );
}

/** Centred in the gap between blocks; the plugin shows "above a block" as the previous block's bottom line. */
function DropLine({ gap }: { gap: number }) {
    const { dropLine } = useDropLine();

    if (!dropLine) return null;

    const offset = (gap - DROP_LINE_HEIGHT) / 2;

    return (
        <div
            contentEditable={false}
            style={{
                height: DROP_LINE_HEIGHT,
                ...(dropLine === 'top'
                    ? { top: -offset - DROP_LINE_HEIGHT }
                    : { bottom: offset }),
            }}
            className="pointer-events-none absolute -inset-x-1.5 rounded-full bg-primary-foreground before:absolute before:top-1/2 before:-left-1.5 before:size-2.5 before:-translate-y-1/2 before:rounded-full before:border-2 before:border-primary-foreground before:bg-background"
        />
    );
}
