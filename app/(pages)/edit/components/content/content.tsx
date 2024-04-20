'use client';

import * as React from 'react';

import Details from '@/app/(pages)/edit/components/content/components/details';
import General from '@/app/(pages)/edit/components/content/components/general';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import { CONTENT_TYPE_LINKS } from '@/utils/constants';

interface Props {
    slug: string;
    content_type: API.ContentType;
    content?: API.AnimeInfo | API.Character | API.Person;
}

const Content = ({ slug, content_type, content }: Props) => {
    const [type, setType] = React.useState<'general' | 'details'>('details');

    if (!content) {
        return null;
    }

    const link = `${CONTENT_TYPE_LINKS[content_type]}/${slug}`;

    const poster = 'poster' in content ? content.poster : content.image;
    const title =
        'title_en' in content
            ? content.title!
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

export default Content;
