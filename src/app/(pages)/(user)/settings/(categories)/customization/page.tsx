import { FC } from 'react';

import P from '@/components/typography/p';
import Header from '@/components/ui/header';

import Customization from '@/features/settings/customization/customization.component';

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
                <Header title="Кастомізація" />
                <P className="text-sm text-muted-foreground">
                    Налаштуйте відображення контенту, теми та інше
                </P>
            </div>
            <Customization />
        </div>
    );
};

export default CustomizationSettingsPage;
