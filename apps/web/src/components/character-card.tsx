import { CharacterResponse, ContentTypeEnum } from '@hikka/client';
import { FC } from 'react';

import ContentCard, { ContentCardProps } from './content-card/content-card';

interface Props extends ContentCardProps {
    character: CharacterResponse;
}

const CharacterCard: FC<Props> = ({ character, ...props }) => {
    return (
        <ContentCard
            slug={character.slug}
            withContextMenu
            content_type={ContentTypeEnum.CHARACTER}
            href={`/characters/${character.slug}`}
            image={character.image}
            title={character.title}
            {...props}
        />
    );
};

export default CharacterCard;
