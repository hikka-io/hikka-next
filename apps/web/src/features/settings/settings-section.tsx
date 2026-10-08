import type { FC, ReactNode } from 'react';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

type Props = {
    title: string;
    children: ReactNode;
};

const SettingsSection: FC<Props> = ({ title, children }) => (
    <div className="flex flex-col gap-4">
        <Header>
            <HeaderContainer>
                <HeaderTitle variant="h4">{title}</HeaderTitle>
            </HeaderContainer>
        </Header>
        {children}
    </div>
);

export default SettingsSection;
