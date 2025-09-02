import { FC } from 'react';

import P from '@/components/typography/p';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import { Customization } from '@/features/settings';

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
                <P className="text-muted-foreground text-sm">
                    Налаштуйте відображення контенту, теми та інше
                </P>
            </div>
            <Customization />
        </div>
    );
};

export default CustomizationSettingsPage;
