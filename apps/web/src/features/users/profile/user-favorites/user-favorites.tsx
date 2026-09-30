import { type FC, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import {
    ContentTypeEnum,
    type FavouriteContentTypeEnum,
    serviceUserStatsOptions,
} from '@hikka/api';

import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import MaterialSymbolsStack from '@/components/icons/material-symbols/MaterialSymbolsStack';
import Block from '@/components/ui/block';
import { type ChipTabOption, ChipTabs } from '@/components/ui/chip-tabs';
import EmptyState from '@/components/ui/empty-state';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { useSession } from '@/services/session';
import { CONTENT_TYPES } from '@/utils/labels';
import { useParams } from '@/utils/navigation';

import FavoriteSection from './components/favorite-section';

const CONTENT_OPTIONS: ChipTabOption<FavouriteContentTypeEnum>[] = [
    {
        label: CONTENT_TYPES[ContentTypeEnum.ANIME].plural,
        value: ContentTypeEnum.ANIME,
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.ANIME],
    },
    {
        label: CONTENT_TYPES[ContentTypeEnum.MANGA].plural,
        value: ContentTypeEnum.MANGA,
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.MANGA],
    },
    {
        label: CONTENT_TYPES[ContentTypeEnum.NOVEL].plural,
        value: ContentTypeEnum.NOVEL,
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.NOVEL],
    },
    {
        label: CONTENT_TYPES[ContentTypeEnum.CHARACTER].plural,
        value: ContentTypeEnum.CHARACTER,
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.CHARACTER],
    },
    {
        label: CONTENT_TYPES[ContentTypeEnum.PERSON].plural,
        value: ContentTypeEnum.PERSON,
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.PERSON],
    },
    {
        label: CONTENT_TYPES[ContentTypeEnum.COLLECTION].plural,
        value: ContentTypeEnum.COLLECTION,
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.COLLECTION],
    },
];

type Props = {
    extended?: boolean;
    type?: FavouriteContentTypeEnum;
};

const UserFavorites: FC<Props> = ({ extended, type }) => {
    const [content, setContent] = useState<FavouriteContentTypeEnum>(
        type ?? ContentTypeEnum.ANIME,
    );
    const params = useParams();
    const navigate = useNavigate();

    const { data: stats } = useQuery(
        serviceUserStatsOptions({
            path: { username: String(params.username) },
        }),
    );

    const { user: loggedUser } = useSession();
    const isOwner =
        !!loggedUser?.username && loggedUser.username === params.username;

    const counts = stats?.favourites_count;
    // Empty categories are dropped for visitors; the owner keeps every tab.
    const visibleOptions =
        counts && !isOwner
            ? CONTENT_OPTIONS.filter(
                  (option) => (counts[option.value] ?? 0) > 0,
              )
            : CONTENT_OPTIONS;
    const options = counts
        ? visibleOptions.map((option) => ({
              ...option,
              count: counts[option.value] ?? 0,
          }))
        : visibleOptions;
    // `content` may point at a dropped tab (deep link, or the `anime` default).
    const activeContent =
        options.find((option) => option.value === content)?.value ??
        options[0]?.value;

    const handleContentChange = (value: FavouriteContentTypeEnum) => {
        setContent(value);

        if (extended) {
            navigate({
                to: '.',
                search: { type: value },
                replace: true,
            });
        }
    };

    if (!activeContent) {
        if (!extended) return null;

        return (
            <Block id="user-favorites">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h2">Улюблені</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <EmptyState
                    bordered
                    icon={<MaterialSymbolsStack />}
                    title={<span>У списку пусто</span>}
                    description="Цей список оновиться після того, як сюди буде щось додано"
                />
            </Block>
        );
    }

    return (
        <Block id="user-favorites">
            <Header
                to={!extended ? `/u/${params.username}/favorites` : undefined}
                search={!extended ? { type: activeContent } : undefined}
            >
                <HeaderContainer>
                    <HeaderTitle variant={extended ? 'h2' : 'h3'}>
                        Улюблені
                    </HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <ChipTabs
                options={options}
                value={activeContent}
                onValueChange={handleContentChange}
            />
            <FavoriteSection
                key={activeContent}
                type={activeContent}
                extended={extended}
            />
        </Block>
    );
};

export default UserFavorites;
