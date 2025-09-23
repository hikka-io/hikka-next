'use client';

import { MarkdownPlugin } from '@platejs/markdown';
import { Value, createSlateEditor } from 'platejs';

import { EditorStatic } from '@/components/plate/ui/editor-static';

import { StaticKit } from './static-kit';

interface StaticEditorProps {
    value?: string | Value;
}

const editor = createSlateEditor({
    plugins: StaticKit,
});

export function StaticViewer({ value }: StaticEditorProps) {
    return (
        <EditorStatic
            variant="default"
            value={
                typeof value === 'string'
                    ? editor
                          .getApi(MarkdownPlugin)
                          .markdown.deserialize(value ?? '')
                    : value
            }
            editor={editor}
        />
    );
}
