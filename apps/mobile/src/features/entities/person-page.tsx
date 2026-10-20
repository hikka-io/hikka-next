import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { FavouriteContentTypeEnum } from '@hikka/api';

import { useTitle } from '@/services/session';

import EntityHeader from './entity-header';
import EntityScreen from './entity-screen';
import { entitySections } from './entity-sections';
import PersonPlaceholder from './person-placeholder';
import { personInfoOptions } from './queries';

type Props = {
    slug: string;
};

const PersonPage: FC<Props> = ({ slug }) => {
    const getTitle = useTitle();
    const { data, isPending, error, refetch } = useQuery(
        personInfoOptions({ path: { slug } }),
    );
    const title = data ? getTitle(data) : '';

    return (
        <EntityScreen
            slug={slug}
            favouriteType={FavouriteContentTypeEnum.PERSON}
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
