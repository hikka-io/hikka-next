'use client';

import {
    Plate,
    type PlateEditor as PlateEditorType,
    PlateProps,
} from '@udecode/plate-common/react';
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
    initialValue?: string;
    className?: string;
    placeholder?: string;
    children?: React.ReactNode;
}

const PlateEditor: FC<PlateEditorProps> = ({
    onValueChange,
    initialValue,
    className,
    placeholder,
    children,
    ...props
}) => {
    const editor = useCreateEditor({ initialValue });

    const onChange = useCallback(() => {
        if (onValueChange) {
            const markdown = serializeMd({ editor });
            onValueChange(markdown);
        }
    }, [onValueChange]);

    return (
        <div
            className={cn(
                'relative grid w-full grid-cols-1 gap-2 rounded-md border border-secondary/60 bg-secondary/30 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1',
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
