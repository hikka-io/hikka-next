'use client';

import { FC } from 'react';

import PlateEditor from '../markdown/editor/plate-editor';
import CommentInputBottomBar from './comment-input-bottom-bar';

interface Props {
    slug: string;
    content_type: API.ContentType;
    comment?: API.Comment;
    className?: string;
    isEdit?: boolean;
}
const CommentInput: FC<Props> = ({ className, comment, isEdit, ...props }) => {
    return (
        <PlateEditor
            className={className}
            initialValue={isEdit && comment ? comment.text : undefined}
            placeholder="Напишіть повідомлення..."
        >
            <CommentInputBottomBar
                comment={comment}
                isEdit={isEdit}
                {...props}
            />
        </PlateEditor>
    );
};

export default CommentInput;
