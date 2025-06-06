'use client';

import { ReadContentType, ReadStatusEnum } from '@hikka/client';
import { useRandomReadByStatus } from '@hikka/react';
import { useParams, useSearchParams } from 'next/navigation';

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

import { CONTENT_TYPES } from '@/utils/constants/common';

import ReadFiltersModal from '../../modals/read-filters-modal.component';

const ToolsCombobox = () => {
    const searchParams = useSearchParams();
    const params = useParams();

    const readStatus = searchParams.get('status')! as ReadStatusEnum;
    const contentType = params.content_type as ReadContentType;

    const mutationRandomRead = useRandomReadByStatus();

    const handleRandomAnime = async () => {
        mutationRandomRead.mutate({
            contentType: contentType,
            username: String(params.username),
            status: readStatus,
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
                    <FeRandom className="mr-2 size-4" /> Випадкове{' '}
                    {CONTENT_TYPES[contentType].title_ua}
                </DropdownMenuItem>
                <ReadFiltersModal
                    sort_type="read"
                    content_type={params.content_type as ReadContentType}
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
