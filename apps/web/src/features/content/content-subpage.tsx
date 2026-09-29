import type { FC, ReactNode } from 'react';

import type { CommentContentTypeEnum, ContentTypeEnum } from '@hikka/api';

import ContentHeader from './content-header';

type Props = {
    slug: string;
    contentType: CommentContentTypeEnum | typeof ContentTypeEnum.USER;
    children: ReactNode;
};

const ContentSubpage: FC<Props> = ({ slug, contentType, children }) => {
    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 p-0">
            <ContentHeader slug={slug} content_type={contentType} />
            {children}
        </div>
    );
};

export default ContentSubpage;
