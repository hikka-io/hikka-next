import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { usePageHeader } from '@/features/app-shell';
import { EditContentList as ContentList } from '@/features/edit';
import { editContentSearchSchema } from '@/utils/search-schemas';

import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

export const Route = createFileRoute('/_pages/edit/content')({
    validateSearch: zodValidator(editContentSearchSchema),
    head: () => ({
        meta: [{ title: 'Контент / Правки / Hikka' }],
    }),
    component: ContentPage,
});

function ContentPage() {
    usePageHeader({ title: 'Незаповнений контент', parent: '/edit' });

    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h2">Незаповнений контент</HeaderTitle>
                </HeaderContainer>
            </Header>
            <ContentList />
        </Block>
    );
}
