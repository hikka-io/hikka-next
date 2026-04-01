'use client';

import { MarkdownPlugin } from '@platejs/markdown';
import { Value, createSlateEditor } from 'platejs';
import { useMemo } from 'react';

import { EditorStatic } from '@/components/plate/ui/editor-static';

import { StaticKit } from './static-kit';

interface StaticEditorProps {
    value?: string | Value;
    className?: string;
}

export function StaticViewer({ value, className }: StaticEditorProps) {
    const editor = useMemo(() => {
        return createSlateEditor({
            plugins: StaticKit,
        });
    }, []);

    const resolvedValue = useMemo(() => {
        if (typeof value === 'string') {
            return editor
                .getApi(MarkdownPlugin)
                .markdown.deserialize(value ?? '');
        }
        return value;
    }, [value, editor]);

    return (
        <EditorStatic
            variant="default"
            value={resolvedValue}
            editor={editor}
            className={className}
        />
    );
}
