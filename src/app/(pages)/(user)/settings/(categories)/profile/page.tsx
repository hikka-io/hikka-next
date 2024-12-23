import { FC } from 'react';

import P from '@/components/typography/p';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import Appearance from '@/features/settings/profile/appearance.component';
import Description from '@/features/settings/profile/description.component';
import Username from '@/features/settings/profile/username.component';

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
                <P className="text-sm text-muted-foreground">
                    Налаштуйте вигляд та деталі свого профілю
                </P>
            </div>
            <Appearance />
            <Username />
            <Description />
        </div>
    );
};

export default ProfileSettingsPage;
