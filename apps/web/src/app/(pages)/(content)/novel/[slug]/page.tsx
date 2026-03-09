import { ContentTypeEnum } from '@hikka/client';
import { FC } from 'react';

import { ContentDetailPage } from '@/features/content';

interface Props {
    params: {
        slug: string;
    };
}

const NovelPage: FC<Props> = async (props) => {
    const params = await props.params;
    const { slug } = params;

    return (
        <ContentDetailPage
            contentType={ContentTypeEnum.NOVEL}
            slug={slug}
        />
    );
};

export default NovelPage;
