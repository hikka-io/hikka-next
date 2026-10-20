import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getTitle } from '@hikka/core';

import EntityHeader from './entity-header';
import EntityScreen from './entity-screen';
import { entitySections } from './entity-sections';
import PersonPlaceholder from './person-placeholder';
import { personInfoOptions } from './queries';

type Props = {
    slug: string;
};

const PersonPage: FC<Props> = ({ slug }) => {
    const { data, isPending, error, refetch } = useQuery(
        personInfoOptions({ path: { slug } }),
    );
    const title = data ? getTitle(data) : '';

    return (
        <EntityScreen
            slug={slug}
            sharePath={`/people/${slug}`}
            title={title}
            isPending={isPending}
            error={error}
            refetch={() => void refetch()}
            header={
                data && (
                    <EntityHeader
                        slug={slug}
                        title={title}
                        original={data.name_native}
                        english={data.name_en}
                        synonyms={data.synonyms}
                        image={
                            data.image ?? <PersonPlaceholder person={data} />
                        }
                        description={data.description_ua}
                    />
                )
            }
            sections={entitySections('person', slug)}
        />
    );
};

export default PersonPage;
