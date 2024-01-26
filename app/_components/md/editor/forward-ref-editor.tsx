'use client';

import { forwardRef } from 'react';



import dynamic from 'next/dynamic';



import { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor';


// ForwardRefEditor.tsx

// This is the only place InitializedMDXEditor is imported directly.
const Editor = dynamic(() => import('./initialized-MDX-editor'), {
    // Make sure we turn SSR off
    ssr: false,
});

// This is what is imported by other components. Pre-initialized with plugins, and ready
// to accept other props, including a ref.
export const ForwardRefEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
    (props, ref) => <Editor {...props} editorRef={ref} />,
);

// TS complains without the following line
ForwardRefEditor.displayName = 'ForwardRefEditor';