import Comment from './comment';

interface Props {
    comments: API.Comment[];
    slug: string;
    content_type: API.ContentType;
}

const Component = ({ comments, slug, content_type }: Props) => {
    return (
        <div className="flex w-full flex-col gap-6">
            {comments.map((comment) => (
                <Comment
                    slug={slug}
                    content_type={content_type}
                    comment={comment}
                    key={comment.reference}
                />
            ))}
        </div>
    );
};

export default Component;
