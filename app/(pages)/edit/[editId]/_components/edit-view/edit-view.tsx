import * as React from 'react';

import AnimeView from './_components/anime-view';
import CharacterView from './_components/character-view';

interface Props {
    content_type: Hikka.ContentType;
}

const Component = ({ content_type }: Props) => {
    if (content_type === 'anime') {
        return <AnimeView />;
    }

    if (content_type === 'character') {
        return <CharacterView />;
    }

    return null;
};

export default Component;