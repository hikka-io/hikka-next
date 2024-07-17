'use client';

import { FC } from 'react';

import H4 from '@/components/typography/h4';
import Block from '@/components/ui/block';

import Details from '@/features/edit/edit-content/details';

import { CONTENT_TYPE_LINKS } from '@/utils/constants';
import { getTitle } from '@/utils/title-adapter';

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

    const image = content.data_type === 'anime' ? content.image : content.image;
    const title = getTitle({ data: content, titleLanguage: 'title_ua' });

    return (
        <Block>
            <H4>Контент</H4>
            <Details content={content} href={link} poster={image} />
        </Block>
    );
};

export default EditContent;
