import { FC } from 'react';

import EntryCard, {
    Props as EntryCardProps,
} from '@/components/entry-card/entry-card';

interface Props extends EntryCardProps {
    character: API.Character;
}

const CharacterCard: FC<Props> = ({ character, ...props }) => {
    return (
        <EntryCard
            slug={character.slug}
            withContextMenu
            content_type="character"
            href={`/characters/${character.slug}`}
            poster={character.image}
            title={character.name_ua || character.name_en || character.name_ja}
            {...props}
        />
    );
};

export default CharacterCard;
