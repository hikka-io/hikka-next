import { FC } from 'react';

import ContentCard, {
    Props as ContentCardProps,
} from '@/components/content-card/content-card';

interface Props extends ContentCardProps {
    person: API.Person;
    roles: {
        name_ua: string;
        name_en: string;
        slug: string;
    }[];
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
            content_type="person"
            withContextMenu
            title={person.name_ua || person.name_en || person.name_native}
            {...props}
        />
    );
};

export default PersonCard;
