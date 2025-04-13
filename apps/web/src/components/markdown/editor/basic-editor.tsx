'use client';

import { Value } from '@udecode/plate';
import {
    Plate,
    type PlateEditor as PlateEditorType,
    PlateProps,
} from '@udecode/plate/react';
import { FC, useCallback } from 'react';

import { cn } from '@/utils/utils';
import { Editor, EditorContainer } from './plate-ui/editor';
import { serializeMd } from './plugins/markdown-plugin/serialize-md';
import { useCreateEditor } from './use-create-editor';

export interface PlateEditorProps
    extends Omit<
        PlateProps<PlateEditorType>,
        'onValueChange' | 'children' | 'editor'
    > {
    onValueChange?: (value: string) => void;
    initialValue?: string | Value;
    className?: string;
    placeholder?: string;
    disableToolbar?: boolean;
    children?: React.ReactNode;
}

const PlateEditor: FC<PlateEditorProps> = ({
    onValueChange,
    initialValue,
    className,
    placeholder,
    disableToolbar,
    children,
    ...props
}) => {
    const editor = useCreateEditor({ initialValue, disableToolbar });

    const onChange = useCallback(() => {
        if (onValueChange) {
            const markdown = serializeMd({ editor });
            onValueChange(markdown);
        }
    }, [onValueChange]);

    return (
        <div
            className={cn(
                'relative grid w-full grid-cols-1 gap-2 rounded-md border border-border bg-secondary/20 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1',
                className,
            )}
        >
            <Plate {...props} editor={editor} onValueChange={onChange}>
                <EditorContainer>
                    <Editor
                        placeholder={placeholder || 'Напишіть повідомлення...'}
                    />
                    {children}
                </EditorContainer>
            </Plate>
        </div>
    );
};

export default PlateEditor;
