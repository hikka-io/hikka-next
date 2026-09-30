import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { RelatedContentTypeEnum } from '@hikka/api';

import AnimeCard from '@/components/content-card/anime-card';
import MangaCard from '@/components/content-card/manga-card';
import NovelCard from '@/components/content-card/novel-card';
import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';
import { useIsDesktop } from '@/services/hooks/use-media-query';
import { useVisibleOnce } from '@/services/hooks/use-visible-once';
import {
    UI_PREFS_DEFAULTS,
    useUiPreferences,
} from '@/services/ui-preferences-store';
import { CONTENT_TYPE_LINKS } from '@/utils/content-paths';
import { useParams } from '@/utils/navigation';

import { franchiseOptions } from '../queries';
import FranchiseFilters from './components/franchise-filters';
import FranchiseItem from './components/franchise-item';
import FranchiseSkeleton from './components/franchise-skeleton';

const PREVIEW_SIZE = 2;

type Props = {
    extended?: boolean;
    content_type: RelatedContentTypeEnum;
};

const Franchise: FC<Props> = ({ extended, content_type }) => {
    const isDesktop = useIsDesktop();
    const { ref, visible } = useVisibleOnce();

    const params = useParams();
    const franchiseView = useUiPreferences(
        (state) => state.views.franchise ?? UI_PREFS_DEFAULTS.views.franchise,
    );
    const franchiseContentTypes = useUiPreferences(
        (state) =>
            state.filters.franchiseContentTypes ??
            UI_PREFS_DEFAULTS.filters.franchiseContentTypes,
    );

    const view = extended ? franchiseView : 'list';
    const contentTypes = extended
        ? franchiseContentTypes
        : UI_PREFS_DEFAULTS.filters.franchiseContentTypes;

    const {
        data: franchise,
        error,
        isPending,
    } = useQuery({
        ...franchiseOptions(content_type, String(params.slug)),
        enabled: extended || visible,
        select: (data) => ({
            list: [...data.anime, ...data.manga, ...data.novel],
        }),
    });

    if (!franchise) {
        return !extended && !error && isPending ? (
            <div ref={ref}>
                <FranchiseSkeleton count={PREVIEW_SIZE} />
            </div>
        ) : null;
    }

    const sortedList = franchise.list.sort((a, b) => {
        if (a.status === 'announced') return -1;
        if (b.status === 'announced') return 1;
        return (b?.year ?? 0) - (a?.year ?? 0);
    });
    const filteredData = extended
        ? sortedList.filter((v) => contentTypes.includes(v.data_type))
        : sortedList
              .filter((v) => v.slug !== params.slug)
              .slice(0, PREVIEW_SIZE);

    const title = (
        <span>
            <span className="truncate">Пов’язане</span>{' '}
            {sortedList && (
                <span className="text-muted-foreground">
                    ({extended ? filteredData.length : sortedList.length})
                </span>
            )}
        </span>
    );

    const block = (
        <Block id="content-franchise">
            <div className="flex items-center justify-between">
                <Header
                    className="flex-1"
                    to={
                        !extended
                            ? `${CONTENT_TYPE_LINKS[content_type]}/${params.slug}/franchise`
                            : undefined
                    }
                >
                    <HeaderContainer>
                        <HeaderTitle>{title}</HeaderTitle>
                    </HeaderContainer>
                    <HeaderNavButton />
                    {extended && <FranchiseFilters />}
                </Header>
            </div>
            <Stack
                extended={extended}
                size={2}
                extendedSize={view === 'list' ? 2 : 5}
                className="grid-min-20"
            >
                {view === 'list' &&
                    filteredData.map((content) => (
                        <FranchiseItem
                            preview={!extended && !isDesktop}
                            key={content.slug}
                            content={content}
                        />
                    ))}

                {view === 'grid' &&
                    filteredData.map((content) => {
                        if (content.data_type === 'anime') {
                            return (
                                <AnimeCard key={content.slug} item={content} />
                            );
                        }

                        if (content.data_type === 'manga') {
                            return (
                                <MangaCard key={content.slug} item={content} />
                            );
                        }

                        if (content.data_type === 'novel') {
                            return (
                                <NovelCard key={content.slug} item={content} />
                            );
                        }

                        return null;
                    })}
            </Stack>
        </Block>
    );

    return extended ? block : <div ref={ref}>{block}</div>;
};

export default Franchise;
