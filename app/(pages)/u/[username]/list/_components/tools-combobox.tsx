'use client';

import { Fragment } from 'react';
import FeRandom from '~icons/fe/random';
import MaterialSymbolsMoreVert from '~icons/material-symbols/more-vert';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { PopoverTrigger } from '@/components/ui/popover';
import getRandomWatch from '@/services/api/watch/getRandomWatch';


const Component = () => {
    const searchParams = useSearchParams();
    const params = useParams();
    const router = useRouter();

    const watchStatus = searchParams.get('status')!;

    const handleToolsChange = async (option: string) => {
        if (option === 'random') {
            try {
                const randomAnime = await getRandomWatch({
                    username: String(params.username),
                    status: watchStatus as Hikka.WatchStatus,
                });

                router.push('/anime/' + randomAnime.slug);
            } catch (e) {
                return;
            }
        }
    };

    return (
        <Combobox
            side="bottom"
            align="end"
            disableCheckbox
            options={[
                {
                    label: (
                        <Fragment>
                            <FeRandom /> Випадкове аніме
                        </Fragment>
                    ),
                    value: 'random',
                },
            ]}
            onChange={(value) => handleToolsChange(value as string)}
            renderToggle={() => (
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                        <MaterialSymbolsMoreVert />
                    </Button>
                </PopoverTrigger>
            )}
        />
    );
};

export default Component;