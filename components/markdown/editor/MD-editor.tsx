'use client';

import { forwardRef } from 'react';



import dynamic from 'next/dynamic';



import { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor';

const Editor = dynamic(() => import('./initialized-MDX-editor'), {
    ssr: false,
});

const MDEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
    (props, ref) => <Editor {...props} editorRef={ref} />,
);

MDEditor.displayName = 'MDEditor';

export default MDEditor;