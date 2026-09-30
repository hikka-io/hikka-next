import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { ContentTypeEnum, type EditContentTypeEnum } from '@hikka/api';

import RulesAlert from '@/components/rules-alert';
import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { usePageHeader } from '@/features/app-shell';
import { EditContent, EditCreateForm, useContentBySlug } from '@/features/edit';
import { contentInfoOptions } from '@/utils/api/content-queries';
import { generateHeadMeta } from '@/utils/metadata';
import { editNewSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/edit/new')({
    validateSearch: zodValidator(editNewSearchSchema),
    beforeLoad: ({ search: { content_type, slug } }) => {
        if (!content_type || !slug) throw redirect({ to: '/edit' });

        return { newEdit: { content_type, slug } };
    },
    loaderDeps: ({ search }) => search,
    loader: async ({ context: { queryClient, apiClient, newEdit } }) => {
        const { content_type, slug } = newEdit;

        switch (content_type) {
            case ContentTypeEnum.ANIME:
            case ContentTypeEnum.MANGA:
            case ContentTypeEnum.NOVEL:
            case ContentTypeEnum.CHARACTER:
            case ContentTypeEnum.PERSON:
                await queryClient.prefetchQuery(
                    contentInfoOptions(content_type, String(slug), apiClient),
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

    usePageHeader({ title: 'Нова правка', parent: '/edit' });

    if (!content) return null;

    return (
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-[1fr_25%]">
            <Block>
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Нова правка</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <div>
                    <RulesAlert
                        rulesFile="RULES.md"
                        before="Перш ніж почати редагування контенту, рекомендуємо ознайомитись з"
                        after="редагування контенту."
                        modalTitle="Правила редагування"
                    />
                </div>
                <EditCreateForm
                    slug={slug}
                    content_type={content_type}
                    content={content}
                />
            </Block>
            <div className="flex flex-col gap-12">
                <EditContent
                    slug={slug}
                    content_type={content_type}
                    content={content}
                />
            </div>
        </div>
    );
}
