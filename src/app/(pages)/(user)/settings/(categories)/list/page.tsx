import { FC } from 'react';

import P from '@/components/typography/p';
import Header from '@/components/ui/header';

import Readlist from '@/features/settings/list/readlist/readlist.component';
import Watchlist from '@/features/settings/list/watchlist/watchlist.component';

interface Props {
    params: {
        slug: string;
    };
}

const ListSettingsPage: FC<Props> = async props => {
    const params = await props.params;
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header title="Список" />
                <P className="text-sm text-muted-foreground">
                    Імпортуйте аніме, манґу чи ранобе
                </P>
            </div>
            <div className="flex flex-col gap-4">
                <Header variant="h4" title="Імпорт аніме" />
                <Watchlist />
            </div>
            <div className="flex flex-col gap-4">
                <Header variant="h4" title="Імпорт манґи та ранобе" />
                <Readlist />
            </div>
        </div>
    );
};

export default ListSettingsPage;
