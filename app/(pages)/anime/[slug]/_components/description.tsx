'use client';

import { useState } from 'react';

import { useParams } from 'next/navigation';

import { useAnimeInfo } from '@/app/page.hooks';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import SubHeader from '@/components/sub-header';
import { Button } from '@/components/ui/button';


const Component = () => {
    const [active, setActive] = useState<'synopsis_ua' | 'synopsis_en'>(
        'synopsis_ua',
    );
    const params = useParams();
    const { data } = useAnimeInfo(String(params.slug));

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