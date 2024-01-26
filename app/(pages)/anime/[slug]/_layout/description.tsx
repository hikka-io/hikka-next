'use client';

import { useState } from 'react';

import { useParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import MDViewer from '@/app/_components/md/viewer/MD-viewer';
import SubHeader from '@/app/_components/sub-header';
import { Button } from '@/app/_components/ui/button';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';


const Component = () => {
    const [active, setActive] = useState<'synopsis_ua' | 'synopsis_en'>(
        'synopsis_ua',
    );
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    if (!data || (!data.synopsis_ua && !data.synopsis_en)) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <SubHeader title="Опис">
                <div className="flex gap-4 flex-wrap">
                    {data.synopsis_ua && (
                        <Button
                            size="badge"
                            variant={
                                active === 'synopsis_ua'
                                    ? 'secondary'
                                    : 'outline'
                            }
                            onClick={() => setActive('synopsis_ua')}
                        >
                            <span className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
                                UA
                            </span>
                        </Button>
                    )}
                    {data.synopsis_en && (
                        <Button
                            size="badge"
                            variant={
                                active === 'synopsis_en'
                                    ? 'secondary'
                                    : 'outline'
                            }
                            onClick={() => setActive('synopsis_en')}
                        >
                            <span className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
                                EN
                            </span>
                        </Button>
                    )}
                </div>
            </SubHeader>
            <MDViewer>
                {data[active] || data.synopsis_ua || data.synopsis_en}
            </MDViewer>
        </div>
    );
};

export default Component;