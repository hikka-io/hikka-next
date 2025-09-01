'use client';

import { MarkdownPlugin } from '@platejs/markdown';
import { Value } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';

import { Editor, EditorContainer } from '../ui/editor';
import { ArticleKit } from './article-kit';
import { CommentKit } from './comment-kit';

export interface CommentPlateEditorProps {
    value?: string;
    children?: React.ReactNode;
    className?: string;
    placeholder?: string;
    onValueChange?: (value: string) => void;
}

export function CommentPlateEditor({
    value,
    children,
    className,
    placeholder = 'Напишіть повідомлення...',
    onValueChange,
}: CommentPlateEditorProps) {
    const editor = usePlateEditor({
        plugins: CommentKit,
        nodeId: false,
        value: (editor) =>
            editor.getApi(MarkdownPlugin).markdown.deserialize(value ?? ''),
    });

    return (
        <Plate
            editor={editor}
            onValueChange={
                onValueChange
                    ? ({ value }) =>
                          onValueChange(
                              editor
                                  .getApi(MarkdownPlugin)
                                  .markdown.serialize(value),
                          )
                    : ({ value }) => console.log(value)
            }
        >
            <EditorContainer className={className}>
                <Editor variant="comment" placeholder={placeholder} />
                {children}
            </EditorContainer>
        </Plate>
    );
}

export interface ArticlePlateEditorProps {
    value?: Value;
    children?: React.ReactNode;
    className?: string;
    placeholder?: string;
    onValueChange?: (value: Value) => void;
}

export function ArticlePlateEditor({
    value,
    children,
    className,
    placeholder = 'Напишіть зміст статті...',
    onValueChange,
}: ArticlePlateEditorProps) {
    const editor = usePlateEditor({
        plugins: ArticleKit,
        value,
        nodeId: false,
    });

    return (
        <Plate
            editor={editor}
            onValueChange={
                onValueChange ? ({ value }) => onValueChange(value) : undefined
            }
        >
            <EditorContainer className={className}>
                <Editor variant="default" placeholder={placeholder} />
                {children}
            </EditorContainer>
        </Plate>
    );
}
