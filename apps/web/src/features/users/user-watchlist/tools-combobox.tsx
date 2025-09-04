'use client';

import { WatchStatusEnum } from '@hikka/client';
import { useRandomWatchByStatus } from '@hikka/react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import FeRandom from '@/components/icons/fe/FeRandom';
import MaterialSymbolsMoreVert from '@/components/icons/material-symbols/MaterialSymbolsMoreVert';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { AnimeFiltersModal } from '@/features/modals';

const ToolsCombobox = () => {
    const searchParams = useSearchParams();
    const params = useParams();
    const router = useRouter();

    const watchStatus = searchParams.get('status')! as WatchStatusEnum;

    const mutationRandomWatch = useRandomWatchByStatus({
        options: {
            onSuccess: (data) => {
                router.push(`/anime/${data.slug}`);
            },
        },
    });

    const handleRandomAnime = async () => {
        mutationRandomWatch.mutate({
            username: String(params.username),
            status: watchStatus,
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-md">
                    <MaterialSymbolsMoreVert />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleRandomAnime}>
                    <FeRandom className="mr-2 size-4" /> Випадкове аніме
                </DropdownMenuItem>
                <AnimeFiltersModal sort_type="watch">
                    <DropdownMenuItem
                        className="flex lg:hidden"
                        onSelect={(e) => e.preventDefault()}
                    >
                        <AntDesignFilterFilled className="mr-2 size-4" />{' '}
                        Фільтри
                    </DropdownMenuItem>
                </AnimeFiltersModal>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ToolsCombobox;
