'use client';

import {
    type DiffOperation,
    type DiffUpdate,
    computeDiff,
    withGetFragmentExcludeDiff,
} from '@platejs/diff';
import { MarkdownPlugin } from '@platejs/markdown';
import { cloneDeep } from 'lodash';
import { type Value, createSlatePlugin } from 'platejs';
import {
    Plate,
    PlateContent,
    PlateElement,
    type PlateElementProps,
    PlateLeaf,
    type PlateLeafProps,
    type PlateProps,
    createPlateEditor,
    createPlatePlugin,
    toPlatePlugin,
    usePlateEditor,
    useSelected,
} from 'platejs/react';
import * as React from 'react';

import { cn } from '@/utils/cn';

import { StaticKit } from './static-kit';

const InlinePlugin = createPlatePlugin({
    key: 'inline',
    node: { isElement: true, isInline: true },
});

const InlineVoidPlugin = createPlatePlugin({
    key: 'inline-void',
    node: { isElement: true, isInline: true, isVoid: true },
});

const diffOperationColors: Record<DiffOperation['type'], string> = {
    delete: 'bg-destructive-foreground/30',
    insert: 'bg-success-foreground/30',
    update: 'bg-info-foreground/30',
};

const describeUpdate = ({ newProperties, properties }: DiffUpdate) => {
    const addedProps: string[] = [];
    const removedProps: string[] = [];
    const updatedProps: string[] = [];

    Object.keys(newProperties).forEach((key) => {
        const oldValue = properties[key];
        const newValue = newProperties[key];

        if (oldValue === undefined) {
            addedProps.push(key);

            return;
        }
        if (newValue === undefined) {
            removedProps.push(key);

            return;
        }

        updatedProps.push(key);
    });

    const descriptionParts = [];

    if (addedProps.length > 0) {
        descriptionParts.push(`Added ${addedProps.join(', ')}`);
    }
    if (removedProps.length > 0) {
        descriptionParts.push(`Removed ${removedProps.join(', ')}`);
    }
    if (updatedProps.length > 0) {
        updatedProps.forEach((key) => {
            descriptionParts.push(
                `Updated ${key} from ${properties[key]} to ${newProperties[key]}`,
            );
        });
    }

    return descriptionParts.join('\n');
};

const InlineElement = ({ children, ...props }: PlateElementProps) => {
    return (
        <PlateElement
            {...props}
            as="span"
            className="rounded-sm bg-slate-200/50 p-1"
        >
            {children}
        </PlateElement>
    );
};

const InlineVoidElement = ({ children, ...props }: PlateElementProps) => {
    const selected = useSelected();

    return (
        <PlateElement {...props} as="span">
            <span
                className={cn(
                    'rounded-sm bg-slate-200/50 p-1',
                    selected && 'bg-blue-500 text-white',
                )}
                contentEditable={false}
            >
                Inline void
            </span>
            {children}
        </PlateElement>
    );
};

const DiffPlugin = toPlatePlugin(
    createSlatePlugin({
        key: 'diff',
        node: { isLeaf: true },
    }).overrideEditor(withGetFragmentExcludeDiff),
    {
        render: {
            node: DiffLeaf,
            aboveNodes:
                () =>
                ({ children, editor, element }) => {
                    if (!element.diff) return children;

                    const diffOperation =
                        element.diffOperation as DiffOperation;

                    const label = (
                        {
                            delete: 'deletion',
                            insert: 'insertion',
                            update: 'update',
                        } as any
                    )[diffOperation.type];

                    const Component = editor.api.isInline(element)
                        ? 'span'
                        : 'div';

                    return (
                        <Component
                            className={diffOperationColors[diffOperation.type]}
                            title={
                                diffOperation.type === 'update'
                                    ? describeUpdate(diffOperation)
                                    : undefined
                            }
                            aria-label={label}
                        >
                            {children}
                        </Component>
                    );
                },
        },
    },
);

function DiffLeaf({ children, ...props }: PlateLeafProps) {
    const diffOperation = props.leaf.diffOperation as DiffOperation;

    const Component = (
        {
            delete: 'del',
            insert: 'ins',
            update: 'span',
        } as any
    )[diffOperation.type];

    return (
        <PlateLeaf
            {...props}
            // as={Component}
            className={diffOperationColors[diffOperation.type]}
            attributes={{
                ...props.attributes,
                title:
                    diffOperation.type === 'update'
                        ? describeUpdate(diffOperation)
                        : undefined,
            }}
        >
            {children}
        </PlateLeaf>
    );
}

const plugins = [
    ...StaticKit,
    InlinePlugin.withComponent(InlineElement),
    InlineVoidPlugin.withComponent(InlineVoidElement),
    DiffPlugin,
];

function VersionHistoryPlate({
    className,
    ...props
}: Omit<PlateProps, 'children'> & { className?: string }) {
    return (
        <Plate {...props}>
            <PlateContent
                className={cn(
                    'rounded-md border border-border bg-secondary/20 p-4 text-sm',
                    className,
                )}
            />
        </Plate>
    );
}

interface DiffProps {
    current: string;
    previous: string;
    className?: string;
}

export function DiffViewer({ current, previous, className }: DiffProps) {
    const diffValue = React.useMemo(() => {
        const editor = createPlateEditor({
            plugins,
        });

        const currentValue = editor
            .getApi(MarkdownPlugin)
            .markdown.deserialize(current);
        const previousValue = editor
            .getApi(MarkdownPlugin)
            .markdown.deserialize(previous);

        return computeDiff(previousValue, cloneDeep(currentValue), {
            isInline: editor.api.isInline,
            lineBreakChar: '¶',
        }) as Value;
    }, [previous, current]);

    const editor = usePlateEditor(
        {
            plugins,
            value: diffValue,
        },
        [diffValue],
    );

    return (
        <VersionHistoryPlate
            className={className}
            key={JSON.stringify(diffValue)}
            readOnly
            editor={editor}
        />
    );
}
