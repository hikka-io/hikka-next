import * as React from 'react';

import AnimeUpdate from './_components/anime-update';
import CharacterUpdate from './_components/character-update';

interface Props {
    content_type: Hikka.ContentType;
}

const Component = ({ content_type }: Props) => {
    if (content_type === 'anime') {
        return <AnimeUpdate />;
    }

    if (content_type === 'character') {
        return <CharacterUpdate />;
    }

    return null;
};

export default Component;