'use client';

import { useMemo } from 'react';

import { MarkdownPlugin } from '@platejs/markdown';
import { createSlateEditor, type Value } from 'platejs';

import { EditorStatic } from '@/components/plate/ui/editor-static';

import { StaticKit } from './static-kit';

type StaticEditorProps = {
    value?: string | Value;
    className?: string;
};

export function StaticViewer({ value, className }: StaticEditorProps) {
    const editor = useMemo(() => {
        return createSlateEditor({
            nodeId: false,
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
