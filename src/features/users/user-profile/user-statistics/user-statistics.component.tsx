import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import ActivityStats from './activity-stats/activity-stats';
import WatchhourStats from './watchhour-stats';

const UserStatistics = () => {
    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle>Статистика</HeaderTitle>
                </HeaderContainer>
            </Header>
            <Block className="md:flex-row">
                <ActivityStats />
                <WatchhourStats />
            </Block>
        </Block>
    );
};

export default UserStatistics;
