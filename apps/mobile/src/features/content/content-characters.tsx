import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { type ContentCharacterResponse, ContentTypeEnum } from '@hikka/api';

import PosterCard from '@/components/content-card/poster-card';
import PosterRow from '@/components/content-card/poster-row';
import { useTitle } from '@/services/session';
import { contentHref } from '@/utils/content-href';

import { useVisibleOnce } from './detail-scroll';
import {
    CHARACTERS_PREVIEW_SIZE,
    type ContentInfo,
    contentCharactersPreviewOptions,
} from './queries';

type Props = {
    content: ContentInfo;
};

const ContentCharacters: FC<Props> = ({ content }) => {
    const getTitle = useTitle();
    const { onLayout, visible } = useVisibleOnce();
    const { data, isError, refetch } = useQuery({
        ...contentCharactersPreviewOptions(content.data_type, content.slug),
        enabled: visible,
    });

    const main = data?.list.filter((entry) => entry.main);

    if (main?.length === 0) {
        return null;
    }

    return (
        <PosterRow<ContentCharacterResponse>
            title="Головні персонажі"
            items={main}
            skeleton={{ count: CHARACTERS_PREVIEW_SIZE }}
            error={isError}
            onRetry={refetch}
            onLayout={onLayout}
            keyExtractor={(entry) => entry.character.slug}
            renderItem={({ character }) => (
                <PosterCard
                    title={getTitle(character)}
                    image={character.image ?? undefined}
                    href={contentHref(
                        ContentTypeEnum.CHARACTER,
                        character.slug,
                    )}
                />
            )}
        />
    );
};

export default ContentCharacters;
