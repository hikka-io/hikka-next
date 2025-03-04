'use client';

import { createSlatePlugin } from '@udecode/plate';
import {
    type DiffOperation,
    type DiffUpdate,
    withGetFragmentExcludeDiff,
} from '@udecode/plate-diff';
import {
    PlateLeaf,
    type PlateLeafProps,
    toPlatePlugin,
} from '@udecode/plate/react';

const diffOperationColors: Record<DiffOperation['type'], string> = {
    delete: 'bg-red-200/50',
    insert: 'bg-green-200/50',
    update: 'bg-blue-200/50',
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

export const DiffPlugin = toPlatePlugin(
    createSlatePlugin({
        key: 'diff',
        node: { isLeaf: true },
    }).overrideEditor(withGetFragmentExcludeDiff),
    {
        render: {
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
            node: DiffLeaf,
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
        <PlateLeaf {...props} asChild>
            <Component
                className={diffOperationColors[diffOperation.type]}
                title={
                    diffOperation.type === 'update'
                        ? describeUpdate(diffOperation)
                        : undefined
                }
            >
                {children}
            </Component>
        </PlateLeaf>
    );
}
