'use client';

import { FC } from 'react';

import H4 from '@/components/typography/h4';
import Block from '@/components/ui/block';

import Details from '@/features/edit/edit-content/details';

import { CONTENT_TYPE_LINKS } from '@/utils/constants';

interface Props {
    slug: string;
    content_type: API.ContentType;
    content?: API.MainContent;
}

const EditContent: FC<Props> = ({ slug, content_type, content }) => {
    if (!content) {
        return null;
    }

    const link = `${CONTENT_TYPE_LINKS[content_type]}/${slug}`;

    const poster =
        content.data_type === 'anime' ? content.poster : content.image;
    const title = (content: API.MainContent) =>
        'title_ua' in content
            ? content.title_ua || content.title_en
            : 'title_original' in content
              ? content.title_original
              : content.name_ua || content.name_en;

    return (
        <Block>
            <H4>Контент</H4>
            <Details content={content} href={link} poster={poster} />
        </Block>
    );
};

export default EditContent;
