import { createPluginFactory, isInline } from '@udecode/plate-common';
import {
    DiffOperation,
    DiffUpdate,
    withGetFragmentExcludeDiff,
} from '@udecode/plate-diff';

export const MARK_DIFF = 'diff';

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

export const createDiffPlugin = createPluginFactory({
    inject: {
        aboveComponent:
            () =>
            ({ children, editor, element }) => {
                if (!element.diff) return children;

                const diffOperation = element.diffOperation as DiffOperation;

                const label = {
                    delete: 'deletion',
                    insert: 'insertion',
                    update: 'update',
                }[diffOperation.type];

                const Component = isInline(editor, element) ? 'span' : 'div';

                return (
                    <Component
                        aria-label={label}
                        className={diffOperationColors[diffOperation.type]}
                        title={
                            diffOperation.type === 'update'
                                ? describeUpdate(diffOperation)
                                : undefined
                        }
                    >
                        {children}
                    </Component>
                );
            },
    },
    isLeaf: true,
    key: MARK_DIFF,
    withOverrides: withGetFragmentExcludeDiff,
});
