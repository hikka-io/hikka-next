import { ContentTypeEnum, EditContentType, MainContent } from '@hikka/client';
import {
    useAnimeBySlug,
    useCharacterBySlug,
    useMangaBySlug,
    useNovelBySlug,
    usePersonBySlug,
} from '@hikka/react';
import {
    animeBySlugOptions,
    characterBySlugOptions,
    mangaBySlugOptions,
    novelBySlugOptions,
    personBySlugOptions,
} from '@hikka/react/options';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import {
    EditContent as Content,
    EditCreateForm as EditForm,
    EditRulesAlert as RulesAlert,
} from '@/features/edit';

import { generateHeadMeta } from '@/utils/metadata';
import { editNewSearchSchema } from '@/utils/search-schemas';

function useContentBySlug(
    contentType: EditContentType,
    slug: string,
): MainContent | undefined {
    const anime = useAnimeBySlug({
        slug,
        options: { enabled: contentType === ContentTypeEnum.ANIME },
    });
    const manga = useMangaBySlug({
        slug,
        options: { enabled: contentType === ContentTypeEnum.MANGA },
    });
    const novel = useNovelBySlug({
        slug,
        options: { enabled: contentType === ContentTypeEnum.NOVEL },
    });
    const character = useCharacterBySlug({
        slug,
        options: { enabled: contentType === ContentTypeEnum.CHARACTER },
    });
    const person = usePersonBySlug({
        slug,
        options: { enabled: contentType === ContentTypeEnum.PERSON },
    });

    switch (contentType) {
        case ContentTypeEnum.ANIME:
            return anime.data;
        case ContentTypeEnum.MANGA:
            return manga.data;
        case ContentTypeEnum.NOVEL:
            return novel.data;
        case ContentTypeEnum.CHARACTER:
            return character.data;
        case ContentTypeEnum.PERSON:
            return person.data;
    }
}

export const Route = createFileRoute('/_pages/edit/new')({
    validateSearch: zodValidator(editNewSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: async ({ context: { queryClient, hikkaClient }, deps }) => {
        const { content_type, slug } = deps;

        if (!content_type || !slug) {
            throw redirect({ to: '/edit' });
        }

        if (content_type === ContentTypeEnum.ANIME) {
            await queryClient.ensureQueryData(
                animeBySlugOptions(hikkaClient, { slug: String(slug) }),
            );
        } else if (content_type === ContentTypeEnum.MANGA) {
            await queryClient.ensureQueryData(
                mangaBySlugOptions(hikkaClient, { slug: String(slug) }),
            );
        } else if (content_type === ContentTypeEnum.NOVEL) {
            await queryClient.ensureQueryData(
                novelBySlugOptions(hikkaClient, { slug: String(slug) }),
            );
        } else if (content_type === ContentTypeEnum.CHARACTER) {
            await queryClient.ensureQueryData(
                characterBySlugOptions(hikkaClient, { slug: String(slug) }),
            );
        } else if (content_type === ContentTypeEnum.PERSON) {
            await queryClient.ensureQueryData(
                personBySlugOptions(hikkaClient, { slug: String(slug) }),
            );
        }

        return { content_type: content_type as EditContentType, slug };
    },
    head: () =>
        generateHeadMeta({
            title: 'Нова правка',
            robots: { index: false },
        }),
    component: EditNewPage,
});

function EditNewPage() {
    const { content_type, slug } = Route.useLoaderData();
    const content = useContentBySlug(content_type, slug);

    if (!content) return null;

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-12">
            <Block>
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Нова правка</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <RulesAlert />
                <EditForm
                    slug={slug}
                    content_type={content_type}
                    content={content}
                />
            </Block>
            <div className="flex flex-col gap-12">
                <Content
                    slug={slug}
                    content_type={content_type}
                    content={content}
                />
            </div>
        </div>
    );
}
