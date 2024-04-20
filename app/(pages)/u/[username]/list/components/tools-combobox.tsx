'use client';

import { Fragment } from 'react';
import AntDesignFilterFilled from '~icons/ant-design/filter-filled';
import FeRandom from '~icons/fe/random';
import MaterialSymbolsMoreVert from '~icons/material-symbols/more-vert';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

import FiltersModal from '@/components/modals/anime-filters-modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import getRandomWatch from '@/services/api/watch/getRandomWatch';

const Component = () => {
    const searchParams = useSearchParams();
    const params = useParams();
    const router = useRouter();

    const watchStatus = searchParams.get('status')!;

    const handleRandomAnime = async () => {
        try {
            const randomAnime = await getRandomWatch({
                username: String(params.username),
                status: watchStatus as API.WatchStatus,
            });

            router.push('/anime/' + randomAnime.slug);
        } catch (e) {
            return;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                    <MaterialSymbolsMoreVert />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleRandomAnime}>
                    <FeRandom className="mr-2 size-4" /> Випадкове аніме
                </DropdownMenuItem>
                <FiltersModal type={'watchlist'}>
                    <DropdownMenuItem
                        className="flex lg:hidden"
                        onSelect={(e) => e.preventDefault()}
                    >
                        <AntDesignFilterFilled className="mr-2 size-4" />{' '}
                        Фільтри
                    </DropdownMenuItem>
                </FiltersModal>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Component;
