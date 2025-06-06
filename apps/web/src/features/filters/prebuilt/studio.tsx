'use client';

import { CompanyTypeEnum } from '@hikka/client';
import { useSearchCompanies } from '@hikka/react';
import { useSearchParams } from 'next/navigation';
import { FC, useState } from 'react';

import {
    Select,
    SelectContent,
    SelectEmpty,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectSearch,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import CollapsibleFilter from '../collapsible-filter';
import useChangeParam from '../use-change-param';

interface Props {
    className?: string;
}

const Studio: FC<Props> = () => {
    const searchParams = useSearchParams()!;

    const studios = searchParams.getAll('studios');

    const [studioSearch, setStudioSearch] = useState<string>();
    const { list, isFetching: isStudioListFetching } = useSearchCompanies({
        args: {
            type: CompanyTypeEnum.STUDIO,
            query: studioSearch,
        },
    });

    const handleChangeParam = useChangeParam();

    const handleStudioSearch = (keyword: string) => {
        if (keyword.length < 3) {
            setStudioSearch(undefined);
            return;
        }

        setStudioSearch(keyword);
    };

    return (
        <CollapsibleFilter title="Студія" active={studios.length > 0}>
            <Select
                multiple
                value={studios}
                onValueChange={(value) => handleChangeParam('studios', value)}
                onSearch={handleStudioSearch}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Виберіть студію..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectSearch placeholder="Назва студії..." />
                    <SelectList>
                        <SelectGroup>
                            {!isStudioListFetching &&
                                list?.map((studio) => (
                                    <SelectItem
                                        key={studio.slug}
                                        value={studio.slug}
                                    >
                                        {studio.name_ua || studio.name_en}
                                    </SelectItem>
                                ))}
                            <SelectEmpty>
                                {isStudioListFetching
                                    ? 'Завантаження...'
                                    : 'Студій не знайдено'}
                            </SelectEmpty>
                        </SelectGroup>
                    </SelectList>
                </SelectContent>
            </Select>
        </CollapsibleFilter>
    );
};

export default Studio;
