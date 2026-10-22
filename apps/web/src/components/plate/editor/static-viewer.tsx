import { useMemo } from 'react';

import { createSlateEditor, type Value } from 'platejs';

import { EditorStatic } from '@/components/plate/ui/editor-static';

import { PreviewStaticKit, StaticKit } from './static-kit';

type StaticEditorProps = {
    value: Value;
    className?: string;
    preview?: boolean;
};

export function StaticViewer({ value, className, preview }: StaticEditorProps) {
    const editor = useMemo(() => {
        return createSlateEditor({
            nodeId: false,
            // createSlateEditor splices core-plugin keys (`p`) out of the array it gets
            plugins: [...(preview ? PreviewStaticKit : StaticKit)],
        });
    }, [preview]);

    return (
        <EditorStatic
            variant={preview ? 'preview' : 'default'}
            value={value}
            editor={editor}
            className={className}
        />
    );
}
