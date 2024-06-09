import { MARK_BOLD, MARK_ITALIC } from '@udecode/plate-basic-marks';
import {
    EElementOrText,
    Plate,
    PlateContent,
    PlateEditor,
    PlateProps,
    TEditor,
    Value,
    createPlateEditor,
    deleteFragment,
    getEndPoint,
    getStartPoint,
    insertNodes,
    select,
    withoutNormalizing,
} from '@udecode/plate-common';
import { ReactNode, useCallback, useEffect, useRef } from 'react';
import MaterialSymbolsFormatBoldRounded from '~icons/material-symbols/format-bold-rounded';
import MaterialSymbolsFormatItalicRounded from '~icons/material-symbols/format-italic-rounded';

import { cn } from '@/utils/utils';

import { LinkToolbarButton } from './plate-ui/link-toolbar-button';
import { MarkToolbarButton } from './plate-ui/mark-toolbar-button';
import { SpoilerToolbarButton } from './plate-ui/spoiler-toolbar-button';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from './plate-ui/toolbar';
import plugins from './plugins';
import { deserializeMd, serializeMd } from './serializer-md';

const md = 'Lorem **ipsum**. language know as';

export interface EditorProps
    extends Omit<
        PlateProps,
        'children' | 'initialValue' | 'value' | 'onChange' | 'editorRef'
    > {
    children?: ReactNode;
    initialValue?: string;
    value?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    className?: string;
    editorRef?: React.MutableRefObject<PlateEditor | null>;
}

const setEditorNodes = <N extends EElementOrText<V>, V extends Value = Value>(
    editor: TEditor<V>,
    nodes: N | N[],
) => {
    withoutNormalizing(editor, () => {
        const start = getStartPoint(editor, []);
        const end = getEndPoint(editor, []);
        const range = { anchor: start, focus: end };
        select(editor, range);
        deleteFragment(editor);
        insertNodes(editor, nodes, { removeEmpty: true });
    });
};

export default function Editor({
    children,
    value,
    initialValue,
    placeholder,
    onChange,
    className,
    editorRef,
    ...props
}: EditorProps) {
    const initialValueUpdated = useRef(false);
    const tmpEditor = createPlateEditor({ plugins });

    editorRef = editorRef || useRef<PlateEditor | null>(null);

    const deserializeValue = useCallback(
        (markdown?: string) => {
            if (!markdown) {
                return undefined;
            }

            const decentralized = deserializeMd(tmpEditor, markdown);

            return decentralized;
        },
        [value, initialValue],
    );

    const handleOnChange = useCallback((value: Value) => {
        onChange!(serializeMd(editorRef?.current!));
    }, []);

    useEffect(() => {
        if (
            initialValue &&
            editorRef?.current! &&
            !initialValueUpdated.current
        ) {
            setEditorNodes(editorRef?.current!, deserializeValue(initialValue));
            initialValueUpdated.current = true;
        }
    }, [initialValue]);

    return (
        <div
            className={cn(
                'grid grid-cols-1 gap-2 rounded-md border border-secondary/60 bg-secondary/30 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1',
                className,
            )}
        >
            <Plate
                editorRef={editorRef}
                value={deserializeValue(value)}
                initialValue={deserializeValue(initialValue)}
                plugins={plugins}
                onChange={onChange && handleOnChange}
                {...props}
            >
                <Toolbar className="w-full p-2">
                    <ToolbarGroup noSeparator>
                        <MarkToolbarButton
                            size="icon-sm"
                            tooltip="Жирний (⌘+B)"
                            nodeType={MARK_BOLD}
                        >
                            <MaterialSymbolsFormatBoldRounded />
                        </MarkToolbarButton>
                        <MarkToolbarButton
                            size="icon-sm"
                            tooltip="Курсив (⌘+I)"
                            nodeType={MARK_ITALIC}
                        >
                            <MaterialSymbolsFormatItalicRounded />
                        </MarkToolbarButton>
                    </ToolbarGroup>
                    <ToolbarSeparator className="h-full" />
                    <ToolbarGroup noSeparator>
                        <LinkToolbarButton
                            tooltip="Посилання (⌘+K)"
                            size="icon-sm"
                        />
                        <SpoilerToolbarButton
                            tooltip="Спойлер (⌘+Shift+S)"
                            size="icon-sm"
                        />
                    </ToolbarGroup>
                </Toolbar>
                <PlateContent
                    className="px-2 pb-2 pt-1 focus:outline-none"
                    placeholder={placeholder || 'Напишіть повідомлення...'}
                />
                {children}
            </Plate>
        </div>
    );
}
