import { FC } from 'react';

import P from '@/components/typography/p';
import Header from '@/components/ui/header';

import Email from '@/features/settings/security/email.component';
import Password from '@/features/settings/security/password.component';

interface Props {
    params: {
        slug: string;
    };
}

const SecuritySettingsPage: FC<Props> = async props => {
    const params = await props.params;
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header title="Безпека" />
                <P className="text-sm text-muted-foreground">
                    Захистіть свій обліковий запис: змініть пароль чи email
                </P>
            </div>
            <div className="flex flex-col gap-4">
                <Header variant="h4" title="Поштова адреса" />
                <Email />
            </div>
            <div className="flex flex-col gap-4">
                <Header variant="h4" title="Пароль" />
                <Password />
            </div>
        </div>
    );
};

export default SecuritySettingsPage;
