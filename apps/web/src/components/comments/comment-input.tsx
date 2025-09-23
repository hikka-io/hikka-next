'use client';

import { CommentResponse, CommentsContentType } from '@hikka/client';
import { FC } from 'react';

import { CommentPlateEditor } from '../plate/editor/plate-editor';
import CommentInputBottomBar from './comment-input-bottom-bar';

interface Props {
    slug: string;
    content_type: CommentsContentType;
    comment?: CommentResponse;
    className?: string;
    isEdit?: boolean;
}
const CommentInput: FC<Props> = ({ className, comment, isEdit, ...props }) => {
    return (
        <CommentPlateEditor
            modalDefaultOpen={comment !== undefined}
            className={className}
            value={isEdit && comment ? comment.text! : undefined}
        >
            <CommentInputBottomBar
                comment={comment}
                isEdit={isEdit}
                {...props}
            />
        </CommentPlateEditor>
    );
};

export default CommentInput;
