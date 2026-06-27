import type { FC } from 'react';

import {
    type AppSchemasRoleResponse,
    ContentTypeEnum,
    type PersonResponse,
} from '@hikka/api';

import { getTitle } from '@/utils/title/get-title';
import { useTitle } from '@/utils/title/use-title';

import ContentCard, { type ContentCardProps } from './content-card';

type Props = ContentCardProps & {
    person: PersonResponse;
    roles: AppSchemasRoleResponse[];
};

const PersonCard: FC<Props> = ({ person, roles, ...props }) => {
    const title = useTitle(person);

    const getRole = (roles: Props['roles']) => {
        if (roles.length === 0) {
            return undefined;
        }

        return getTitle(roles[0]);
    };

    return (
        <ContentCard
            key={person.slug}
            href={`/people/${person.slug}`}
            description={getRole(roles)}
            image={person.image}
            slug={person.slug}
            content_type={ContentTypeEnum.PERSON}
            withContextMenu
            title={title}
            {...props}
        />
    );
};

export default PersonCard;
