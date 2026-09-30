import { useMemo } from 'react';

import { createSlateEditor, type Value } from 'platejs';

import { EditorStatic } from '@/components/plate/ui/editor-static';

import { StaticKit } from './static-kit';

type StaticEditorProps = {
    value: Value;
    className?: string;
};

export function StaticViewer({ value, className }: StaticEditorProps) {
    const editor = useMemo(() => {
        return createSlateEditor({
            nodeId: false,
            // createSlateEditor splices core-plugin keys (`p`) out of the array it gets
            plugins: [...StaticKit],
        });
    }, []);

    return (
        <EditorStatic
            variant="default"
            value={value}
            editor={editor}
            className={className}
        />
    );
}
