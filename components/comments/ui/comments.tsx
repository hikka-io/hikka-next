import Comment from './comment';

interface Props {
    comments: Hikka.Comment[];
    slug: string;
    content_type: Hikka.ContentType;
}


const Component = ({ comments, slug, content_type }: Props) => {
    return (
        <div className="flex flex-col gap-6 w-full">
            {comments.map((comment) => (
                <Comment slug={slug} content_type={content_type} comment={comment} key={comment.reference} />
            ))}
        </div>
    );
};

export default Component;