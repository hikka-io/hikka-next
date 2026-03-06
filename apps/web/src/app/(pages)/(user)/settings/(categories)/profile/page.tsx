import { FC } from 'react';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import {
    ProfileAppearance,
    ProfileDescription,
    ProfileUsername,
} from '@/features/settings';

interface Props {
    params: {
        slug: string;
    };
}

const ProfileSettingsPage: FC<Props> = async (props) => {
    const params = await props.params;
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Профіль</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <p className="text-sm text-muted-foreground">
                    Налаштуйте вигляд та деталі свого профілю
                </p>
            </div>
            <ProfileAppearance />
            <ProfileUsername />
            <ProfileDescription />
        </div>
    );
};

export default ProfileSettingsPage;
