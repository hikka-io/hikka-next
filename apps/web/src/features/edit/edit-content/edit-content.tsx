import type { FC } from 'react';

import type { EditContentTypeEnum } from '@hikka/api';
import { contentPath } from '@hikka/core';

import Block from '@/components/ui/block';
import { Header, HeaderTitle } from '@/components/ui/header';

import type { EditMainContent } from '../types';
import EditContentDetails from './edit-content-details';
import EditContentGeneral from './edit-content-general';

type Props = {
    slug: string;
    content_type: EditContentTypeEnum;
    content?: EditMainContent;
};

const EditContent: FC<Props> = ({ slug, content_type, content }) => {
    if (!content) {
        return null;
    }

    const link = contentPath(content_type, slug);

    return (
        <Block variant="card">
            <Header>
                <HeaderTitle to={link} linkProps={{ target: '_blank' }}>
                    Контент
                </HeaderTitle>
            </Header>
            <div className="flex flex-col gap-4">
                <EditContentGeneral
                    content={content}
                    content_type={content_type}
                    slug={slug}
                />
                <div className="border-border border-t" />
                <EditContentDetails content={content} />
            </div>
        </Block>
    );
};

export default EditContent;
