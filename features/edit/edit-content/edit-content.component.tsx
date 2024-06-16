'use client';

import * as React from 'react';
import { FC } from 'react';

import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';

import Details from '@/features/edit/edit-content/details';
import General from '@/features/edit/edit-content/general';

import { CONTENT_TYPE_LINKS } from '@/utils/constants';

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
            <Header title="Контент" variant="h4">
                <Button
                    variant={type === 'details' ? 'secondary' : 'outline'}
                    size="badge"
                    onClick={() => setType('details')}
                >
                    Деталі
                </Button>
                <Button
                    variant={type === 'general' ? 'secondary' : 'outline'}
                    size="badge"
                    onClick={() => setType('general')}
                >
                    Загальне
                </Button>
            </Header>
            {type === 'general' && (
                <General href={link} poster={poster} title={title} />
            )}
            {type === 'details' && <Details content={content} />}
        </Block>
    );
};

export default EditContent;
