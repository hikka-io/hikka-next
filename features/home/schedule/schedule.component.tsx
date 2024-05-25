'use client';

import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import useAnimeSchedule from '@/services/hooks/stats/useAnimeSchedule';

import ScheduleItem from './schedule-item';

const Schedule = () => {
    const { list } = useAnimeSchedule();

    const filteredList = list
        ?.filter((item) => item.airing_at * 1000 > Date.now())
        .slice(0, 4);

    return (
        <Block>
            <Header title="Календар" href="/schedule" />
            <Stack className="grid-min-18 xl:grid-cols-4">
                {filteredList?.map((item) => (
                    <ScheduleItem
                        key={item.airing_at + item.anime.slug}
                        item={item}
                    />
                ))}
            </Stack>
        </Block>
    );
};

export default Schedule;
