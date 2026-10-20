import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getTitle } from '@hikka/core';

import EntityHeader from './entity-header';
import EntityScreen from './entity-screen';
import { entitySections } from './entity-sections';
import { characterInfoOptions } from './queries';

type Props = {
    slug: string;
};

const CharacterPage: FC<Props> = ({ slug }) => {
    const { data, isPending, error, refetch } = useQuery(
        characterInfoOptions({ path: { slug } }),
    );
    const title = data ? getTitle(data) : '';

    return (
        <EntityScreen
            slug={slug}
            sharePath={`/characters/${slug}`}
            title={title}
            isPending={isPending}
            error={error}
            refetch={() => void refetch()}
            header={
                data && (
                    <EntityHeader
                        slug={slug}
                        title={title}
                        original={data.name_ja}
                        english={data.name_en}
                        synonyms={data.synonyms}
                        image={data.image ?? undefined}
                        description={data.description_ua}
                    />
                )
            }
            sections={entitySections('character', slug)}
        />
    );
};

export default CharacterPage;
