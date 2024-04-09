'use client';

import { useState } from 'react';

import { useParams } from 'next/navigation';

import MDViewer from '@/components/markdown/viewer/MD-viewer';
import SubHeader from '@/components/sub-header';
import TextExpand from '@/components/text-expand';
import { Button } from '@/components/ui/button';
import useCharacterInfo from '@/services/hooks/characters/useCharacterInfo';

const Description = () => {
    const [active, setActive] = useState<'description_ua'>('description_ua');
    const params = useParams();
    const { data: character } = useCharacterInfo({ slug: String(params.slug) });

    if (!character || !character.description_ua) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <SubHeader title="Опис">
                <div className="flex flex-wrap gap-4">
                    {character.description_ua && (
                        <Button
                            size="badge"
                            variant={
                                active === 'description_ua'
                                    ? 'secondary'
                                    : 'outline'
                            }
                            onClick={() => setActive('description_ua')}
                        >
                            <span className="w-full truncate">UA</span>
                        </Button>
                    )}
                </div>
            </SubHeader>
            <TextExpand>
                <MDViewer>
                    {character[active] || character.description_ua}
                </MDViewer>
            </TextExpand>
        </div>
    );
};

export default Description;
