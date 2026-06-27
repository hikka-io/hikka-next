import { useQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import {
    animeSlugOptions,
    ContentTypeEnum,
    characterInfoOptions,
    type EditContentTypeEnum,
    mangaInfoOptions,
    novelInfoOptions,
    personInfoOptions,
} from '@hikka/api';

import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import {
    EditContent as Content,
    EditCreateForm as EditForm,
    EditRulesAlert as RulesAlert,
} from '@/features/edit';
import type { EditMainContent } from '@/features/edit/types';
import { generateHeadMeta } from '@/utils/metadata';
import { editNewSearchSchema } from '@/utils/search-schemas';

function useContentBySlug(
    contentType: EditContentTypeEnum,
    slug: string,
): EditMainContent | undefined {
    const anime = useQuery({
        ...animeSlugOptions({ path: { slug } }),
        enabled: contentType === ContentTypeEnum.ANIME,
    });
    const manga = useQuery({
        ...mangaInfoOptions({ path: { slug } }),
        enabled: contentType === ContentTypeEnum.MANGA,
    });
    const novel = useQuery({
        ...novelInfoOptions({ path: { slug } }),
        enabled: contentType === ContentTypeEnum.NOVEL,
    });
    const character = useQuery({
        ...characterInfoOptions({ path: { slug } }),
        enabled: contentType === ContentTypeEnum.CHARACTER,
    });
    const person = useQuery({
        ...personInfoOptions({ path: { slug } }),
        enabled: contentType === ContentTypeEnum.PERSON,
    });

    // The detail endpoints return richer *InfoResponse/*SlugResponse supersets
    // of the base entity responses that make up EditMainContent (the edit UI
    // only reads the shared subset). Narrow them down to the shared union.
    switch (contentType) {
        case ContentTypeEnum.ANIME:
            return anime.data as EditMainContent | undefined;
        case ContentTypeEnum.MANGA:
            return manga.data as EditMainContent | undefined;
        case ContentTypeEnum.NOVEL:
            return novel.data as EditMainContent | undefined;
        case ContentTypeEnum.CHARACTER:
            return character.data as EditMainContent | undefined;
        case ContentTypeEnum.PERSON:
            return person.data as EditMainContent | undefined;
    }
}

export const Route = createFileRoute('/_pages/edit/new')({
    validateSearch: zodValidator(editNewSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: async ({ context: { queryClient, apiClient }, deps }) => {
        const { content_type, slug } = deps;

        if (!content_type || !slug) {
            throw redirect({ to: '/edit' });
        }

        if (content_type === ContentTypeEnum.ANIME) {
            await queryClient.ensureQueryData(
                animeSlugOptions({
                    path: { slug: String(slug) },
                    client: apiClient,
                }),
            );
        } else if (content_type === ContentTypeEnum.MANGA) {
            await queryClient.ensureQueryData(
                mangaInfoOptions({
                    path: { slug: String(slug) },
                    client: apiClient,
                }),
            );
        } else if (content_type === ContentTypeEnum.NOVEL) {
            await queryClient.ensureQueryData(
                novelInfoOptions({
                    path: { slug: String(slug) },
                    client: apiClient,
                }),
            );
        } else if (content_type === ContentTypeEnum.CHARACTER) {
            await queryClient.ensureQueryData(
                characterInfoOptions({
                    path: { slug: String(slug) },
                    client: apiClient,
                }),
            );
        } else if (content_type === ContentTypeEnum.PERSON) {
            await queryClient.ensureQueryData(
                personInfoOptions({
                    path: { slug: String(slug) },
                    client: apiClient,
                }),
            );
        }

        return { content_type: content_type as EditContentTypeEnum, slug };
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
