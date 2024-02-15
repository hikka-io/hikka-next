import * as React from 'react';

import AnimeNew from './_components/anime-new';
import CharacterNew from './_components/character-new';

interface Props {
    content_type: Hikka.ContentType;
    slug: string;
}

const Component = ({ content_type, slug }: Props) => {
    if (content_type === 'anime') {
        return <AnimeNew slug={slug} />;
    }

    if (content_type === 'character') {
        return <CharacterNew slug={slug} />;
    }

    return null;
};

export default Component;