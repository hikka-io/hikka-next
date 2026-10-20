import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getTitle } from '@hikka/core';

import EntityHeader from './entity-header';
import EntityScreen from './entity-screen';
import PersonPlaceholder from './person-placeholder';
import {
    PersonAnime,
    PersonCharacters,
    PersonManga,
    PersonNovel,
} from './person-sections';
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
            sections={[
                <PersonCharacters key="characters" slug={slug} />,
                <PersonAnime key="anime" slug={slug} />,
                <PersonManga key="manga" slug={slug} />,
                <PersonNovel key="novel" slug={slug} />,
            ]}
        />
    );
};

export default PersonPage;
