import {
    MDXEditorMethods,
    MDXEditorProps,
    directivesPlugin,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    toolbarPlugin,
} from '@mdxeditor/editor';
import dynamic from 'next/dynamic';
import React, { forwardRef } from 'react';

import { SpoilerDirectiveDescriptor } from './directives/spoiler-directive';
import BoldButton from './toolbar/bold-button';
import ItalicButton from './toolbar/italic-button';
import LinkButton from './toolbar/link-button';
import { LinkDialog } from './toolbar/link-dialog';
import SpoilerButton from './toolbar/spoiler-button';

const Editor = dynamic(() => import('./initialized-MDX-editor'), {
    ssr: false,
});

const MDEditor = forwardRef<MDXEditorMethods, MDXEditorProps>((props, ref) => (
    <Editor
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
        contentEditableClassName="text-foreground"
        className="rounded-md border border-secondary/60 bg-secondary/30 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
        editorRef={ref}
        {...props}
    />
));

MDEditor.displayName = 'MDEditor';

export default MDEditor;
