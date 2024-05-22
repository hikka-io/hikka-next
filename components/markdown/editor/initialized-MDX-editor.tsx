import {
    MDXEditor,
    type MDXEditorMethods,
    type MDXEditorProps,
} from '@mdxeditor/editor';
import type { ForwardedRef } from 'react';
import React from 'react';

export default function InitializedMDXEditor({
    editorRef,
    ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
    return <MDXEditor {...props} ref={editorRef} />;
}
