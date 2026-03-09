import { ContentTypeEnum } from '@hikka/client';
import { FC } from 'react';

import { ContentDetailPage } from '@/features/content';

interface Props {
    params: {
        slug: string;
    };
}

const MangaPage: FC<Props> = async (props) => {
    const params = await props.params;
    const { slug } = params;

    return (
        <ContentDetailPage
            contentType={ContentTypeEnum.MANGA}
            slug={slug}
        />
    );
};

export default MangaPage;
