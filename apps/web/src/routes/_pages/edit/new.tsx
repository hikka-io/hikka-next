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
    useContentBySlug,
} from '@/features/edit';
import { generateHeadMeta } from '@/utils/metadata';
import { editNewSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/edit/new')({
    validateSearch: zodValidator(editNewSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: async ({ context: { queryClient, apiClient }, deps }) => {
        const { content_type, slug } = deps;

        if (!content_type || !slug) {
            throw redirect({ to: '/edit' });
        }

        if (content_type === ContentTypeEnum.ANIME) {
            await queryClient.prefetchQuery(
                animeSlugOptions({
                    path: { slug: String(slug) },
                    client: apiClient,
                }),
            );
        } else if (content_type === ContentTypeEnum.MANGA) {
            await queryClient.prefetchQuery(
                mangaInfoOptions({
                    path: { slug: String(slug) },
                    client: apiClient,
                }),
            );
        } else if (content_type === ContentTypeEnum.NOVEL) {
            await queryClient.prefetchQuery(
                novelInfoOptions({
                    path: { slug: String(slug) },
                    client: apiClient,
                }),
            );
        } else if (content_type === ContentTypeEnum.CHARACTER) {
            await queryClient.prefetchQuery(
                characterInfoOptions({
                    path: { slug: String(slug) },
                    client: apiClient,
                }),
            );
        } else if (content_type === ContentTypeEnum.PERSON) {
            await queryClient.prefetchQuery(
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
