import type { FC } from 'react';

import {
    type AppCommonSchemasPersonRoleResponse,
    ContentTypeEnum,
    type PersonResponse,
} from '@hikka/api';
import { getTitle } from '@hikka/core';

import EntityCard, { type EntityCardProps } from './entity-card';

type Props = Omit<EntityCardProps, 'entity'> & {
    person: PersonResponse;
    roles: AppCommonSchemasPersonRoleResponse[];
};

const PersonCard: FC<Props> = ({ person, roles, ...props }) => (
    <EntityCard
        entity={{ type: ContentTypeEnum.PERSON, data: person }}
        withContextMenu
        description={roles[0] ? getTitle(roles[0]) : undefined}
        {...props}
    />
);

export default PersonCard;
