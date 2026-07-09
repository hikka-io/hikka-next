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

import { FIELD_BASE } from '@/components/ui/field-base';
import { cn } from '@/utils/cn';

import { BaseBasicBlocksKit } from './plugins/basic-blocks-base-kit';
import { BaseBasicMarksKit } from './plugins/basic-marks-base-kit';
import { BaseLinkKit } from './plugins/link-base-kit';
import { BaseListKit } from './plugins/list-classic-base-kit';
import { MarkdownKit } from './plugins/markdown-kit';
import { BaseSpoilerKit } from './plugins/spoiler-base-kit';

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

// Mirror the markdown editor's element plugins (base/static variants) so the
// diff renders descriptions with the same nodes the editor produces — no
// video/image kits, which descriptions never contain.
const plugins = [
    ...BaseBasicBlocksKit,
    ...BaseLinkKit,
    ...BaseSpoilerKit,
    ...BaseBasicMarksKit,
    ...BaseListKit,
    ...MarkdownKit,
    DiffPlugin,
];

function VersionHistoryPlate({
    className,
    ...props
}: Omit<PlateProps, 'children'> & { className?: string }) {
    return (
        <Plate {...props}>
            <PlateContent className={cn(FIELD_BASE, 'prose p-4', className)} />
        </Plate>
    );
}

type DiffProps = {
    current: string;
    previous: string;
    className?: string;
};

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
