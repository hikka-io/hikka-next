import {
    ContentTypeEnum,
    EditContentType,
    EditContent,
} from '@hikka/client';
import {
    animeBySlugOptions,
    characterBySlugOptions,
    mangaBySlugOptions,
    novelBySlugOptions,
    personBySlugOptions,
} from '@hikka/react/options';
import { zodValidator } from '@tanstack/zod-adapter';
import { createFileRoute, redirect } from '@tanstack/react-router';

import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import {
    EditContent as Content,
    EditCreateForm as EditForm,
    EditRulesAlert as RulesAlert,
} from '@/features/edit';
import { generateHeadMeta } from '@/utils/metadata';
import { editNewSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/edit/new')({
    validateSearch: zodValidator(editNewSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: async ({
        context: { queryClient, hikkaClient },
        deps,
    }) => {
        const { content_type, slug } = deps;

        if (!content_type || !slug) {
            throw redirect({ to: '/edit' });
        }

        let content: EditContent | undefined;

        if (content_type === ContentTypeEnum.ANIME) {
            content = await queryClient.ensureQueryData(
                animeBySlugOptions(hikkaClient, { slug: String(slug) }),
            );
        } else if (content_type === ContentTypeEnum.MANGA) {
            content = await queryClient.ensureQueryData(
                mangaBySlugOptions(hikkaClient, { slug: String(slug) }),
            );
        } else if (content_type === ContentTypeEnum.NOVEL) {
            content = await queryClient.ensureQueryData(
                novelBySlugOptions(hikkaClient, { slug: String(slug) }),
            );
        } else if (content_type === ContentTypeEnum.CHARACTER) {
            content = await queryClient.ensureQueryData(
                characterBySlugOptions(hikkaClient, { slug: String(slug) }),
            );
        } else if (content_type === ContentTypeEnum.PERSON) {
            content = await queryClient.ensureQueryData(
                personBySlugOptions(hikkaClient, { slug: String(slug) }),
            );
        }

        if (!content) throw redirect({ to: '/edit' });

        return { content, content_type: content_type as EditContentType, slug };
    },
    head: () =>
        generateHeadMeta({
            title: 'Нова правка',
            robots: { index: false },
        }),
    component: EditNewPage,
});

function EditNewPage() {
    const { content, content_type, slug } = Route.useLoaderData();

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
