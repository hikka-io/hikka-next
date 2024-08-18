'use client';

import * as React from 'react';
import { FC } from 'react';

import Block from '@/components/ui/block';
import Header from '@/components/ui/header';

import Details from '@/features/edit/edit-content/details';
import General from '@/features/edit/edit-content/general';

import { CONTENT_TYPE_LINKS } from '@/utils/constants';
import { getTitle } from '@/utils/title-adapter';

interface Props {
    slug: string;
    content_type: API.ContentType;
    content?: API.MainContent;
}

const EditContent: FC<Props> = ({ slug, content_type, content }) => {
    const [type, setType] = React.useState<'general' | 'details'>('details');

    if (!content) {
        return null;
    }

    const link = `${CONTENT_TYPE_LINKS[content_type]}/${slug}`;

    const image = content.data_type === 'anime' ? content.image : content.image;
    const title = getTitle({ data: content, titleLanguage: 'title_ua' });

    return (
        <Block>
            <Header
                href={link}
                linkProps={{ target: '_blank' }}
                title="Контент"
            ></Header>
            <Details content={content} />
            <General image={image} title={title} />
        </Block>
    );
};

export default EditContent;
