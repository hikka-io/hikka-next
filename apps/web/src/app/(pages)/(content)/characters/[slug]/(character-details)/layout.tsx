import { ContentTypeEnum } from '@hikka/client';
import { FC, PropsWithChildren } from 'react';

import ContentHeader from '@/features/comments/content-header';

interface Props extends PropsWithChildren {
    params: {
        slug: string;
    };
}

const CharacterDetailsLayout: FC<Props> = async (props) => {
    const params = await props.params;
    const { children } = props;

    return (
        <div className="w-full mx-auto flex max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    disableBreadcrumbs
                    slug={params.slug}
                    content_type={ContentTypeEnum.CHARACTER}
                />
                {children}
            </div>
        </div>
    );
};

export default CharacterDetailsLayout;
