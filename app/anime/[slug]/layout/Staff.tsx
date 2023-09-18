'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getAnimeStaff from '@/utils/api/anime/getAnimeStaff';
import EntryCard from '@/app/components/EntryCard';

interface Props {
    extended?: boolean;
}


const Component = ({ extended }: Props) => {
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['staff', params.slug],
        queryFn: () => getAnimeStaff({ slug: String(params.slug) }),
    });

    if (!data || !data.list || data.list.length === 0) {
        return null;
    }

    const filteredData = extended ? data.list : data.list.slice(0, 6);

    return (
        <div className="flex flex-col gap-8">
            <h3>Автори</h3>
            <div className="grid md:grid-cols-6 grid-cols-3 gap-4">
                {filteredData.map((staff) => (
                        <EntryCard
                            key={staff.person.slug}
                            href={`/person/${staff.person.slug}`}
                            poster={staff.person.image}
                            title={staff.person.name_ua || staff.person.name_en || staff.person.name_native}
                        />
                    ))}
            </div>
        </div>
    );
};

export default Component;
