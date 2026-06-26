import type { FC } from 'react';

import { type CharacterResponse, ContentTypeEnum } from '@hikka/api';
import { useTitle } from '@hikka/react';

import ContentCard, { type ContentCardProps } from './content-card';

type Props = ContentCardProps & {
    character: CharacterResponse;
};

const CharacterCard: FC<Props> = ({ character, ...props }) => {
    const title = useTitle(character);

    return (
        <ContentCard
            slug={character.slug}
            withContextMenu
            content_type={ContentTypeEnum.CHARACTER}
            href={`/characters/${character.slug}`}
            image={character.image}
            title={title}
            {...props}
        />
    );
};

export default CharacterCard;
