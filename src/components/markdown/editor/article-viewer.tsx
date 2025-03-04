'use client';

import { Value } from '@udecode/plate';
import {
    type PlateEditor as ArticleViewerType,
    Plate,
    PlateProps,
} from '@udecode/plate/react';
import { FC } from 'react';

import { cn } from '@/utils/utils';

import { Editor, EditorContainer } from './plate-ui/editor';
import { useCreateArticleEditor } from './use-create-article-editor';

export interface ArticleViewerProps
    extends Omit<PlateProps<ArticleViewerType>, 'children' | 'editor'> {
    initialValue?: string | Value;
    className?: string;
    children?: React.ReactNode;
}

const ArticleViewer: FC<ArticleViewerProps> = ({
    initialValue,
    className,
    children,
    ...props
}) => {
    const editor = useCreateArticleEditor({
        initialValue,
        disableToolbar: true,
        readOnly: true,
    });

    return (
        <div className={cn(className)}>
            <Plate {...props} editor={editor}>
                <EditorContainer>
                    <Editor readOnly className="p-0" />
                    {children}
                </EditorContainer>
            </Plate>
        </div>
    );
};

export default ArticleViewer;
