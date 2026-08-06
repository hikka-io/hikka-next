import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { ContentTypeEnum } from '@hikka/api';

import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { usePageHeader } from '@/features/app-shell';
import { EditContentList, TodoContentTabs } from '@/features/edit';
import { editContentSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/edit/content')({
    validateSearch: zodValidator(editContentSearchSchema),
    head: () => ({
        meta: [{ title: 'Контент / Правки / Hikka' }],
    }),
    component: ContentPage,
});

function ContentPage() {
    const { tab } = Route.useSearch();

    usePageHeader({ title: 'Незаповнений контент', parent: '/edit' });

    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h2">Незаповнений контент</HeaderTitle>
                </HeaderContainer>
            </Header>
            <TodoContentTabs value={tab ?? ContentTypeEnum.ANIME} />
            <EditContentList />
        </Block>
    );
}
