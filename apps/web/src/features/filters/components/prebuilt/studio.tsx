'use client';

import { CompanyTypeEnum } from '@hikka/client';
import { useSearchCompanies } from '@hikka/react';
import { Building2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FC, useMemo, useState } from 'react';

import { CollapsibleFilter } from '@/components/collapsible-filter';
import FormSelect, { FormSelectProps } from '@/components/form/form-select';
import { Label } from '@/components/ui/label';
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

import { useChangeParam } from '@/features/filters';

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

    const options = useMemo(() => {
        return (
            list &&
            list.map((studio) => ({
                value: studio.slug,
                label: studio.name,
            }))
        );
    }, [list]);

    const handleChangeParam = useChangeParam();

    const handleStudioSearch = (keyword: string) => {
        if (keyword.length < 3) {
            setStudioSearch(undefined);
            return;
        }

        setStudioSearch(keyword);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="size-4 shrink-0" />
                <Label>Студія</Label>
            </div>
            <Select
                multiple
                value={studios}
                onValueChange={(value) => handleChangeParam('studios', value)}
                onSearch={handleStudioSearch}
                options={options}
            >
                <SelectTrigger size="md">
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
                                        {studio.name}
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
        </div>
    );

    return (
        <CollapsibleFilter
            title="Студія"
            icon={<Building2 className="size-4" />}
            active={studios.length > 0}
        >
            <Select
                multiple
                value={studios}
                onValueChange={(value) => handleChangeParam('studios', value)}
                onSearch={handleStudioSearch}
                options={options}
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
                                        {studio.name}
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

export const FormStudio: FC<Props & Partial<FormSelectProps>> = (props) => {
    const [studioSearch, setStudioSearch] = useState<string>();
    const { list, isFetching: isStudioListFetching } = useSearchCompanies({
        args: {
            type: CompanyTypeEnum.STUDIO,
            query: studioSearch,
        },
    });

    const options = useMemo(() => {
        return (
            list &&
            list.map((studio) => ({
                value: studio.slug,
                label: studio.name,
            }))
        );
    }, [list]);

    const handleStudioSearch = (keyword: string) => {
        if (keyword.length < 3) {
            setStudioSearch(undefined);
            return;
        }

        setStudioSearch(keyword);
    };

    return (
        <FormSelect
            {...props}
            name="studios"
            label="Студія"
            placeholder="Виберіть студію..."
            multiple
            options={options}
            onSearch={handleStudioSearch}
        >
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
                                    {studio.name}
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
        </FormSelect>
    );
};

export default Studio;
