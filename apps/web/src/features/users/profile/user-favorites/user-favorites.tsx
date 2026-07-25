import { type FC, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import {
    ContentTypeEnum,
    type FavouriteContentTypeEnum,
    serviceUserStatsOptions,
} from '@hikka/api';

import MaterialSymbolsAnimatedImages from '@/components/icons/material-symbols/MaterialSymbolsAnimatedImages';
import MaterialSymbolsFace3 from '@/components/icons/material-symbols/MaterialSymbolsFace3';
import MaterialSymbolsMenuBookRounded from '@/components/icons/material-symbols/MaterialSymbolsMenuBookRounded';
import MaterialSymbolsPalette from '@/components/icons/material-symbols/MaterialSymbolsPalette';
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
import { useSession } from '@/features/auth/hooks/use-session';
import { useParams } from '@/utils/navigation';

import Anime from './components/favorite-anime';
import Character from './components/favorite-characters';
import Collections from './components/favorite-collections';
import Manga from './components/favorite-manga';
import Novel from './components/favorite-novel';

const CONTENT_OPTIONS: ChipTabOption<FavouriteContentTypeEnum>[] = [
    {
        label: 'Аніме',
        value: ContentTypeEnum.ANIME,
        icon: MaterialSymbolsAnimatedImages,
    },
    {
        label: 'Манґа',
        value: ContentTypeEnum.MANGA,
        icon: MaterialSymbolsPalette,
    },
    {
        label: 'Ранобе',
        value: ContentTypeEnum.NOVEL,
        icon: MaterialSymbolsMenuBookRounded,
    },
    {
        label: 'Персонажі',
        value: ContentTypeEnum.CHARACTER,
        icon: MaterialSymbolsFace3,
    },
    {
        label: 'Колекції',
        value: ContentTypeEnum.COLLECTION,
        icon: MaterialSymbolsStack,
    },
];

type Props = {
    extended?: boolean;
    type?: FavouriteContentTypeEnum;
};

const Favorites: FC<Props> = ({ extended, type }) => {
    const [content, setContent] = useState<FavouriteContentTypeEnum>(
        type ?? ContentTypeEnum.ANIME,
    );
    const params = useParams();
    const navigate = useNavigate();

    const { data: stats } = useQuery({
        ...serviceUserStatsOptions({
            path: { username: String(params.username) },
        }),
        enabled: !!params.username,
    });

    const { user: loggedUser } = useSession();
    const isOwner =
        !!loggedUser?.username && loggedUser.username === params.username;

    const counts = stats?.favourites_count;
    // Empty categories are dropped for visitors; the owner keeps every tab.
    const options =
        counts && !isOwner
            ? CONTENT_OPTIONS.filter(
                  (option) => (counts[option.value] ?? 0) > 0,
              )
            : CONTENT_OPTIONS;
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

    const getComponent = () => {
        switch (activeContent) {
            case ContentTypeEnum.ANIME:
                return <Anime extended={extended} />;
            case ContentTypeEnum.CHARACTER:
                return <Character extended={extended} />;
            case ContentTypeEnum.MANGA:
                return <Manga extended={extended} />;
            case ContentTypeEnum.NOVEL:
                return <Novel extended={extended} />;
            case ContentTypeEnum.COLLECTION:
                return <Collections extended={extended} />;
            default:
                return null;
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
            {getComponent()}
        </Block>
    );
};

export default Favorites;
