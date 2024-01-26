'use client';

// InitializedMDXEditor.tsx
import { ContainerDirective } from 'mdast-util-directive';
import type { ForwardedRef } from 'react';

import {
    Button,
    MDXEditor,
    type MDXEditorMethods,
    type MDXEditorProps,
    directivesPlugin,
    insertDirective$,
    toolbarPlugin,
    usePublisher,
} from '@mdxeditor/editor';



// Only import this to the next file
export default function InitializedMDXEditor({
    editorRef,
    ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
    return (
        <MDXEditor
            {...props}
            ref={editorRef}
        />
    );
}