import { FC } from 'react';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import { Effects, Preferences, Styles } from '@/features/settings';

interface Props {
    params: {
        slug: string;
    };
}

const CustomizationSettingsPage: FC<Props> = async (props) => {
    const params = await props.params;
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Кастомізація</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <p className="text-sm text-muted-foreground">
                    Налаштуйте відображення контенту, теми та інше
                </p>
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Загальне</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <Preferences />
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Вигляд</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <Styles />
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Ефекти</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <Effects />
            </div>
        </div>
    );
};

export default CustomizationSettingsPage;
