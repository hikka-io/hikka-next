import { ContentTypeEnum, PersonResponse, RoleResponse } from '@hikka/client';
import { FC } from 'react';

import ContentCard, { ContentCardProps } from './content-card/content-card';

interface Props extends ContentCardProps {
    person: PersonResponse;
    roles: RoleResponse[];
}

const PersonCard: FC<Props> = ({ person, roles, ...props }) => {
    const getRole = (roles: Props['roles']) => {
        if (roles.length === 0) {
            return undefined;
        }

        return roles[0].name_ua || roles[0].name_en;
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
            title={person.title}
            {...props}
        />
    );
};

export default PersonCard;
