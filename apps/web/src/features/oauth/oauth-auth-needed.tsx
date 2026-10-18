import type { FC } from 'react';

import MaterialSymbolsLoginRounded from '@/components/icons/material-symbols/MaterialSymbolsLoginRounded';
import Card from '@/components/ui/card';
import { Header, HeaderTitle } from '@/components/ui/header';
import { LoginButton } from '@/features/auth';

type Props = {};

const OAuthAuthNeeded: FC<Props> = () => {
    return (
        <Card className="w-full flex-row items-center justify-between">
            <div className="flex items-center gap-4">
                <MaterialSymbolsLoginRounded className="text-3xl text-muted-foreground" />
                <div className="flex flex-1 flex-col">
                    <Header>
                        <HeaderTitle truncate>Авторизація</HeaderTitle>
                    </Header>
                    <p className="line-clamp-2 text-muted-foreground text-sm">
                        Вам необхідно авторизуватись, перш ніж надати доступ
                    </p>
                </div>
            </div>
            <LoginButton variant="outline" />
        </Card>
    );
};

export default OAuthAuthNeeded;
