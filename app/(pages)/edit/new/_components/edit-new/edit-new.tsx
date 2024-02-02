import * as React from 'react';

import AnimeParams from './_components/anime-params';
import CharacterParams from './_components/character-params';

interface Props {
    content_type: Hikka.ContentType;
    slug: string;
}

const Component = ({ content_type, slug }: Props) => {
    if (content_type === 'anime') {
        return <AnimeParams slug={slug} />;
    }

    if (content_type === 'character') {
        return <CharacterParams slug={slug} />;
    }

    return null;
};

export default Component;