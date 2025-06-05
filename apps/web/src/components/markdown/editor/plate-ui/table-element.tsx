'use client';

import type * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { PopoverAnchor } from '@radix-ui/react-popover';
import { cn, withRef } from '@udecode/cn';
import { BlockSelectionPlugin } from '@udecode/plate-selection/react';
import { type TTableElement } from '@udecode/plate-table';
import {
    TablePlugin,
    TableProvider,
    useTableBordersDropdownMenuContentState,
    useTableElement,
    useTableMergeState,
} from '@udecode/plate-table/react';
import {
    PlateElement,
    useEditorPlugin,
    useEditorRef,
    useEditorSelector,
    useElement,
    usePluginOption,
    useReadOnly,
    useRemoveNodeButton,
    useSelected,
    withHOC,
} from '@udecode/plate/react';
import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    CombineIcon,
    Grid2X2Icon,
    SquareSplitHorizontalIcon,
    Trash2Icon,
    XIcon,
} from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuTrigger,
} from '../../../ui/dropdown-menu';
import { Popover, PopoverContent } from '../../../ui/popover';
import {
    BorderAll,
    BorderBottom,
    BorderLeft,
    BorderNone,
    BorderRight,
    BorderTop,
} from './table-icons';
import { Toolbar, ToolbarButton, ToolbarGroup } from './toolbar';

export const TableElement = withHOC(
    TableProvider,
    withRef<typeof PlateElement>(({ children, className, ...props }, ref) => {
        const readOnly = useReadOnly();
        const isSelectionAreaVisible = usePluginOption(
            BlockSelectionPlugin,
            'isSelectionAreaVisible',
        );
        const hasControls = !readOnly && !isSelectionAreaVisible;
        const selected = useSelected();
        const {
            isSelectingCell,
            marginLeft,
            props: tableProps,
        } = useTableElement();

        const content = (
            <PlateElement
                className={cn(
                    className,
                    'overflow-x-auto py-5',
                    hasControls && '-ml-2 *:data-[slot=block-selection]:left-2',
                )}
                style={{ paddingLeft: marginLeft }}
                {...props}
            >
                <div className="group/table relative w-fit">
                    <table
                        ref={ref}
                        className={cn(
                            'ml-px mr-0 table h-px table-fixed border-collapse',
                            isSelectingCell && 'selection:bg-transparent',
                        )}
                        {...tableProps}
                    >
                        <tbody className="min-w-full">{children}</tbody>
                    </table>
                </div>
            </PlateElement>
        );

        if (readOnly || !selected) {
            return content;
        }

        return <TableFloatingToolbar>{content}</TableFloatingToolbar>;
    }),
);

export const TableFloatingToolbar = withRef<typeof PopoverContent>(
    ({ children, ...props }, ref) => {
        const { tf } = useEditorPlugin(TablePlugin);
        const element = useElement<TTableElement>();
        const { props: buttonProps } = useRemoveNodeButton({ element });
        const collapsed = useEditorSelector(
            (editor) => !editor.api.isExpanded(),
            [],
        );

        const { canMerge, canSplit } = useTableMergeState();

        return (
            <Popover open={canMerge || canSplit || collapsed} modal={false}>
                <PopoverAnchor asChild>{children}</PopoverAnchor>
                <PopoverContent
                    ref={ref}
                    asChild
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    contentEditable={false}
                    {...props}
                >
                    <Toolbar
                        className="scrollbar-hide flex w-auto max-w-[80vw] flex-row overflow-x-auto rounded-md border bg-secondary/20 p-1 shadow-md backdrop-blur print:hidden"
                        contentEditable={false}
                    >
                        <ToolbarGroup>
                            {canMerge && (
                                <ToolbarButton
                                    onClick={() => tf.table.merge()}
                                    onMouseDown={(e) => e.preventDefault()}
                                    tooltip="Обʼєднати комірки"
                                >
                                    <CombineIcon />
                                </ToolbarButton>
                            )}
                            {canSplit && (
                                <ToolbarButton
                                    onClick={() => tf.table.split()}
                                    onMouseDown={(e) => e.preventDefault()}
                                    tooltip="Розділити комірки"
                                >
                                    <SquareSplitHorizontalIcon />
                                </ToolbarButton>
                            )}

                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <ToolbarButton tooltip="Межі комірок">
                                        <Grid2X2Icon />
                                    </ToolbarButton>
                                </DropdownMenuTrigger>

                                <DropdownMenuPortal>
                                    <TableBordersDropdownMenuContent />
                                </DropdownMenuPortal>
                            </DropdownMenu>

                            {collapsed && (
                                <ToolbarGroup>
                                    <ToolbarButton
                                        tooltip="Видалити таблицю"
                                        {...buttonProps}
                                    >
                                        <Trash2Icon />
                                    </ToolbarButton>
                                </ToolbarGroup>
                            )}
                        </ToolbarGroup>

                        {collapsed && (
                            <ToolbarGroup>
                                <ToolbarButton
                                    onClick={() => {
                                        tf.insert.tableRow({ before: true });
                                    }}
                                    onMouseDown={(e) => e.preventDefault()}
                                    tooltip="Вставити рядок перед"
                                >
                                    <ArrowUp />
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => {
                                        tf.insert.tableRow();
                                    }}
                                    onMouseDown={(e) => e.preventDefault()}
                                    tooltip="Вставити рядок після"
                                >
                                    <ArrowDown />
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => {
                                        tf.remove.tableRow();
                                    }}
                                    onMouseDown={(e) => e.preventDefault()}
                                    tooltip="Видалити рядок"
                                >
                                    <XIcon />
                                </ToolbarButton>
                            </ToolbarGroup>
                        )}

                        {collapsed && (
                            <ToolbarGroup>
                                <ToolbarButton
                                    onClick={() => {
                                        tf.insert.tableColumn({ before: true });
                                    }}
                                    onMouseDown={(e) => e.preventDefault()}
                                    tooltip="Вставити стовпець перед"
                                >
                                    <ArrowLeft />
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => {
                                        tf.insert.tableColumn();
                                    }}
                                    onMouseDown={(e) => e.preventDefault()}
                                    tooltip="Вставити стовпець після"
                                >
                                    <ArrowRight />
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => {
                                        tf.remove.tableColumn();
                                    }}
                                    onMouseDown={(e) => e.preventDefault()}
                                    tooltip="Видалити стовпець"
                                >
                                    <XIcon />
                                </ToolbarButton>
                            </ToolbarGroup>
                        )}
                    </Toolbar>
                </PopoverContent>
            </Popover>
        );
    },
);

export const TableBordersDropdownMenuContent = withRef<
    typeof DropdownMenuPrimitive.Content
>((props, ref) => {
    const editor = useEditorRef();
    const {
        getOnSelectTableBorder,
        hasBottomBorder,
        hasLeftBorder,
        hasNoBorders,
        hasOuterBorders,
        hasRightBorder,
        hasTopBorder,
    } = useTableBordersDropdownMenuContentState();

    return (
        <DropdownMenuContent
            ref={ref}
            className={cn('min-w-[220px]')}
            onCloseAutoFocus={(e) => {
                e.preventDefault();
                editor.tf.focus();
            }}
            align="start"
            side="right"
            sideOffset={0}
            {...props}
        >
            <DropdownMenuGroup>
                <DropdownMenuCheckboxItem
                    checked={hasTopBorder}
                    onCheckedChange={getOnSelectTableBorder('top')}
                >
                    <BorderTop />
                    <div>Верхня границя</div>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={hasRightBorder}
                    onCheckedChange={getOnSelectTableBorder('right')}
                >
                    <BorderRight />
                    <div>Права границя</div>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={hasBottomBorder}
                    onCheckedChange={getOnSelectTableBorder('bottom')}
                >
                    <BorderBottom />
                    <div>Нижня границя</div>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={hasLeftBorder}
                    onCheckedChange={getOnSelectTableBorder('left')}
                >
                    <BorderLeft />
                    <div>Ліва границя</div>
                </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>

            <DropdownMenuGroup>
                <DropdownMenuCheckboxItem
                    checked={hasNoBorders}
                    onCheckedChange={getOnSelectTableBorder('none')}
                >
                    <BorderNone />
                    <div>Без рамки</div>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={hasOuterBorders}
                    onCheckedChange={getOnSelectTableBorder('outer')}
                >
                    <BorderAll />
                    <div>Зовнішня рамка</div>
                </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    );
});
