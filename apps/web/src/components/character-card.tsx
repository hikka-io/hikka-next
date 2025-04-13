import { FC } from 'react';

import ContentCard, {
    Props as ContentCardProps,
} from './content-card/content-card';

interface Props extends ContentCardProps {
    character: API.Character;
}

const CharacterCard: FC<Props> = ({ character, ...props }) => {
    return (
        <ContentCard
            slug={character.slug}
            withContextMenu
            content_type="character"
            href={`/characters/${character.slug}`}
            image={character.image}
            title={character.name_ua || character.name_en || character.name_ja}
            {...props}
        />
    );
};

export default CharacterCard;
