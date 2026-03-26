import { ContentTypeEnum, PersonResponse, RoleResponse } from '@hikka/client';
import { useTitle } from '@hikka/react';
import { getTitle } from '@hikka/react/utils';
import { FC } from 'react';

import ContentCard, { ContentCardProps } from './content-card';

interface Props extends ContentCardProps {
    person: PersonResponse;
    roles: RoleResponse[];
}

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
