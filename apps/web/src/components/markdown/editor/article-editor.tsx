'use client';

import { Value } from '@udecode/plate';
import {
    type PlateEditor as ArticleEditorType,
    Plate,
    PlateProps,
} from '@udecode/plate/react';
import { FC } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { cn } from '@/utils/utils';
import { Editor, EditorContainer } from './plate-ui/editor';
import { useCreateArticleEditor } from './use-create-article-editor';

export interface ArticleEditorProps
    extends Omit<PlateProps<ArticleEditorType>, 'children' | 'editor'> {
    initialValue?: string | Value;
    className?: string;
    placeholder?: string;
    disableToolbar?: boolean;
    children?: React.ReactNode;
}

const ArticleEditor: FC<ArticleEditorProps> = ({
    initialValue,
    className,
    placeholder,
    disableToolbar,
    onValueChange,
    children,
    ...props
}) => {
    const editor = useCreateArticleEditor({ initialValue, disableToolbar });

    return (
        <div
            className={cn(
                'relative grid w-full grid-cols-1 gap-2 rounded-md border border-border bg-secondary/20 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1',
                className,
            )}
        >
            <DndProvider backend={HTML5Backend}>
                <Plate {...props} onValueChange={onValueChange} editor={editor}>
                    <EditorContainer>
                        <Editor
                            placeholder={
                                placeholder || 'Напишіть повідомлення...'
                            }
                        />
                        {children}
                    </EditorContainer>
                </Plate>
            </DndProvider>
        </div>
    );
};

export default ArticleEditor;
