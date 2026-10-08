import type { FC, ReactNode } from 'react';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

type Props = {
    title: string;
    description: string;
    action?: ReactNode;
    trailingAction?: ReactNode;
    children: ReactNode;
};

const SettingsPage: FC<Props> = ({
    title,
    description,
    action,
    trailingAction,
    children,
}) => (
    <div className="flex flex-col gap-8">
        <div className="flex flex-col">
            <Header>
                <HeaderContainer>
                    <HeaderTitle>{title}</HeaderTitle>
                    {action}
                </HeaderContainer>
                {trailingAction}
            </Header>
            <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        {children}
    </div>
);

export default SettingsPage;
