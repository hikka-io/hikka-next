'use client';

import { FC } from 'react';

import BasicEditor from '../markdown/editor/basic-editor';
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
        <BasicEditor
            className={className}
            initialValue={isEdit && comment ? comment.text : undefined}
            placeholder="Напишіть повідомлення..."
        >
            <CommentInputBottomBar
                comment={comment}
                isEdit={isEdit}
                {...props}
            />
        </BasicEditor>
    );
};

export default CommentInput;
