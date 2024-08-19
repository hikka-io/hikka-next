'use client';

import { useMutation } from '@tanstack/react-query';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import AntDesignFilterFilled from '~icons/ant-design/filter-filled';
import FeRandom from '~icons/fe/random';
import MaterialSymbolsMoreVert from '~icons/material-symbols/more-vert';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import ReadFiltersModal from '@/features/modals/read-filters-modal';

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
                <ReadFiltersModal
                    sort_type="read"
                    content_type={params.content_type as API.ContentType}
                >
                    <DropdownMenuItem
                        className="flex lg:hidden"
                        onSelect={(e) => e.preventDefault()}
                    >
                        <AntDesignFilterFilled className="mr-2 size-4" />{' '}
                        Фільтри
                    </DropdownMenuItem>
                </ReadFiltersModal>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ToolsCombobox;
