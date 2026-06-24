'use client';

import * as React from 'react';

import {
    computeDiff,
    type DiffOperation,
    type DiffUpdate,
    withGetFragmentExcludeDiff,
} from '@platejs/diff';
import { MarkdownPlugin } from '@platejs/markdown';
import { cloneDeep } from 'lodash-es';
import { createSlatePlugin, type Value } from 'platejs';
import {
    createPlateEditor,
    Plate,
    PlateContent,
    PlateLeaf,
    type PlateLeafProps,
    type PlateProps,
    toPlatePlugin,
    usePlateEditor,
} from 'platejs/react';

import { cn } from '@/utils/cn';

import { StaticKit } from './static-kit';

const diffOperationColors: Record<DiffOperation['type'], string> = {
    delete: 'bg-destructive text-destructive-foreground',
    insert: 'bg-success text-success-foreground',
    update: 'bg-info text-info-foreground',
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

    return (
        <PlateLeaf
            {...props}
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

const plugins = [...StaticKit, DiffPlugin];

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
            nodeId: false,
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

    const diffKey = React.useMemo(() => JSON.stringify(diffValue), [diffValue]);

    const editor = usePlateEditor(
        {
            nodeId: false,
            plugins,
            value: diffValue,
        },
        [diffValue],
    );

    return (
        <VersionHistoryPlate
            className={className}
            key={diffKey}
            readOnly
            editor={editor}
        />
    );
}
