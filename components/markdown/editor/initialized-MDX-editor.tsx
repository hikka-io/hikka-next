'use client';

// InitializedMDXEditor.tsx
import type { ForwardedRef } from 'react';
import React from 'react';



import {
    MDXEditor,
    type MDXEditorMethods,
    type MDXEditorProps,
    directivesPlugin,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    toolbarPlugin,
} from '@mdxeditor/editor';



import { SpoilerDirectiveDescriptor } from '@/components/markdown/editor/directives/spoiler-directive';
import BoldButton from '@/components/markdown/editor/toolbar/bold-button';
import ItalicButton from '@/components/markdown/editor/toolbar/italic-button';
import LinkButton from '@/components/markdown/editor/toolbar/link-button';
import { LinkDialog } from '@/components/markdown/editor/toolbar/link-dialog';
import SpoilerButton from '@/components/markdown/editor/toolbar/spoiler-button';


// Only import this to the next file
export default function InitializedMDXEditor({
    editorRef,
    ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
    return (
        <MDXEditor
            plugins={[
                linkDialogPlugin({ LinkDialog: () => <LinkDialog /> }),
                linkPlugin(),
                listsPlugin(),
                directivesPlugin({
                    directiveDescriptors: [SpoilerDirectiveDescriptor],
                }),
                toolbarPlugin({
                    toolbarContents: () => (
                        <>
                            <BoldButton />
                            <ItalicButton />
                            <SpoilerButton />
                            <LinkButton />
                        </>
                    ),
                }),
            ]}
            {...props}
            ref={editorRef}
        />
    );
}