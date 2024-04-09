'use client';

import clsx from 'clsx';

import { useParams } from 'next/navigation';

import EntryCard from '@/components/entry-card/entry-card';
import SubHeader from '@/components/sub-header';
import { Button } from '@/components/ui/button';
import useStaff from '@/services/hooks/anime/useStaff';

interface Props {
    extended?: boolean;
}

const Staff = ({ extended }: Props) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useStaff({ slug: String(params.slug) });

    const getRole = (
        roles: { name_ua: string; name_en: string; slug: string }[],
    ) => {
        if (roles.length === 0) {
            return undefined;
        }

        return roles[0].name_ua || roles[0].name_en;
    };

    if (!list || list.length === 0) {
        return null;
    }

    const filteredData = extended ? list : list.slice(0, 4);

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title="Автори"
                href={!extended ? params.slug + '/staff' : undefined}
            />
            <div
                className={clsx(
                    'grid grid-cols-3 gap-4 md:grid-cols-4 lg:gap-8',
                    extended && 'md:grid-cols-6',
                    !extended &&
                        'grid-flow-col grid-cols-scroll auto-cols-scroll overflow-x-auto no-scrollbar -mx-4 px-4',
                )}
            >
                {filteredData.map((staff) => (
                    <EntryCard
                        key={staff.person.slug}
                        href={`/people/${staff.person.slug}`}
                        description={getRole(staff.roles)}
                        poster={staff.person.image}
                        slug={staff.person.slug}
                        content_type="person"
                        withContextMenu
                        title={
                            staff.person.name_ua ||
                            staff.person.name_en ||
                            staff.person.name_native
                        }
                    />
                ))}
            </div>
            {extended && hasNextPage && (
                <Button
                    variant="outline"
                    ref={ref}
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                >
                    {isFetchingNextPage && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Завантажити ще
                </Button>
            )}
        </div>
    );
};

export default Staff;
