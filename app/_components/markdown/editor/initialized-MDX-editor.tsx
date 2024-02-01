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
    toolbarPlugin,
} from '@mdxeditor/editor';

import { SpoilerDirectiveDescriptor } from '@/app/_components/markdown/editor/directives/spoiler-directive';
import BoldButton from '@/app/_components/markdown/editor/toolbar/bold-button';
import ItalicButton from '@/app/_components/markdown/editor/toolbar/italic-button';
import LinkButton from '@/app/_components/markdown/editor/toolbar/link-button';
import { LinkDialog } from '@/app/_components/markdown/editor/toolbar/link-dialog';
import SpoilerButton from '@/app/_components/markdown/editor/toolbar/spoiler-button';

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