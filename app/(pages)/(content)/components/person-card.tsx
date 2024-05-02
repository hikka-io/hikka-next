import { FC } from 'react';

import EntryCard, {
    Props as EntryCardProps,
} from '@/components/entry-card/entry-card';

interface Props extends EntryCardProps {
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
        <EntryCard
            key={person.slug}
            href={`/people/${person.slug}`}
            description={getRole(roles)}
            poster={person.image}
            slug={person.slug}
            content_type="person"
            withContextMenu
            title={person.name_ua || person.name_en || person.name_native}
            {...props}
        />
    );
};

export default PersonCard;
