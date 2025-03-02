import { FC } from 'react';

import P from '@/components/typography/p';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import Email from '@/features/settings/security/email.component';
import Password from '@/features/settings/security/password.component';

interface Props {
    params: {
        slug: string;
    };
}

const SecuritySettingsPage: FC<Props> = async (props) => {
    const params = await props.params;
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Безпека</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <P className="text-sm text-muted-foreground">
                    Захистіть свій обліковий запис: змініть пароль чи email
                </P>
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Поштова адреса</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <Email />
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Безпека</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Пароль</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <Password />
            </div>
        </div>
    );
};

export default SecuritySettingsPage;
