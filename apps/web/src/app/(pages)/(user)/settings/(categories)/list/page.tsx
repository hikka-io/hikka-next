import { FC } from 'react';

import P from '@/components/typography/p';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import {
    ExportXml,
    ListRemoval,
    ReadlistSettings,
    WatchlistSettings,
} from '@/features/settings';

interface Props {
    params: {
        slug: string;
    };
}

const ListSettingsPage: FC<Props> = async (props) => {
    const params = await props.params;
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Список</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <P className="text-sm text-muted-foreground">
                    Імпортуйте аніме, манґу чи ранобе
                </P>
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">
                            Експорт списків
                        </HeaderTitle>
                    </HeaderContainer>
                </Header>
                <ExportXml />
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Імпорт аніме</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <WatchlistSettings />
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">
                            Імпорт манґи та ранобе
                        </HeaderTitle>
                    </HeaderContainer>
                </Header>
                <ReadlistSettings />
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Видалення списку</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <ListRemoval />
            </div>
        </div>
    );
};

export default ListSettingsPage;
