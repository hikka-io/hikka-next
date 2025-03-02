'use client';

import { useMutation } from '@tanstack/react-query';
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

import AnimeFiltersModal from '@/features/modals/anime-filters-modal.component';

import getRandomWatch from '@/services/api/watch/getRandomWatch';

const ToolsCombobox = () => {
    const searchParams = useSearchParams();
    const params = useParams();
    const router = useRouter();

    const watchStatus = searchParams.get('status')!;

    const mutation = useMutation({
        mutationFn: getRandomWatch,
        onSuccess: (data) => {
            router.push('/anime/' + data.slug);
        },
    });

    const handleRandomAnime = async () => {
        mutation.mutate({
            params: {
                username: String(params.username),
                status: watchStatus as API.WatchStatus,
            },
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
