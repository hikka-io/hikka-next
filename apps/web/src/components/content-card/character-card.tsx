import type { FC } from 'react';

import { type CharacterResponse, ContentTypeEnum } from '@hikka/api';

import EntityCard, { type EntityCardProps } from './entity-card';

type Props = Omit<EntityCardProps, 'entity'> & {
    character: CharacterResponse;
};

const CharacterCard: FC<Props> = ({ character, ...props }) => (
    <EntityCard
        entity={{ type: ContentTypeEnum.CHARACTER, data: character }}
        withContextMenu
        {...props}
    />
);

export default CharacterCard;
