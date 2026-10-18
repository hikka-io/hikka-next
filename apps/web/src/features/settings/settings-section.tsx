import type { FC, ReactNode } from 'react';

import { Header, HeaderTitle } from '@/components/ui/header';

type Props = {
    title: string;
    children: ReactNode;
};

const SettingsSection: FC<Props> = ({ title, children }) => (
    <div className="flex flex-col gap-4">
        <Header>
            <HeaderTitle as="h3" size="subsection">
                {title}
            </HeaderTitle>
        </Header>
        {children}
    </div>
);

export default SettingsSection;
