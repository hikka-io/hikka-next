import { FC } from 'react';

import P from '../../../../../../components/typography/p';
import {
    Header,
    HeaderContainer,
    HeaderTitle,
} from '../../../../../../components/ui/header';
import Notifications from '../../../../../../features/settings/notifications/notifications.component';

interface Props {
    params: {
        slug: string;
    };
}

const NotificationsSettingsPage: FC<Props> = async (props) => {
    const params = await props.params;
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Сповіщення</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <P className="text-sm text-muted-foreground">
                    Налаштуйте персоналізовані сповіщення
                </P>
            </div>
            <Notifications />
        </div>
    );
};

export default NotificationsSettingsPage;
