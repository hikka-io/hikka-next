import { type FC, useMemo, useState } from 'react';

import { Building2 } from 'lucide-react';

import { CompanyTypeEnum, searchCompaniesInfiniteOptions } from '@hikka/api';

import {
    SelectField,
    type SelectFieldProps,
} from '@/components/form/form-select';
import { useTypedAppFormContext } from '@/components/form/use-app-form';
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
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useRouteSearch } from '@/utils/navigation';

import { useChangeParam } from './use-change-param';

const STUDIO_SEARCH_MIN_LENGTH = 3;

type Props = {
    className?: string;
};

const Studio: FC<Props> = () => {
    const { studios = [] } = useRouteSearch<{ studios?: string[] }>();

    const [studioSearch, setStudioSearch] = useState<string>();
    const { list, isFetching: isStudioListFetching } = useInfiniteList(
        searchCompaniesInfiniteOptions({
            body: {
                type: CompanyTypeEnum.STUDIO,
                query: studioSearch,
            },
        }),
    );

    const options = useMemo(() => {
        return list?.map((studio) => ({
            value: studio.slug,
            label: studio.name,
        }));
    }, [list]);

    const handleChangeParam = useChangeParam();

    const handleStudioSearch = (keyword: string) => {
        if (keyword.length < STUDIO_SEARCH_MIN_LENGTH) {
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
};

export const FormStudio: FC<Props & Partial<SelectFieldProps>> = (props) => {
    const [studioSearch, setStudioSearch] = useState<string>();
    const { list, isFetching: isStudioListFetching } = useInfiniteList(
        searchCompaniesInfiniteOptions({
            body: {
                type: CompanyTypeEnum.STUDIO,
                query: studioSearch,
            },
        }),
    );

    const options = useMemo(() => {
        return list?.map((studio) => ({
            value: studio.slug,
            label: studio.name,
        }));
    }, [list]);

    const handleStudioSearch = (keyword: string) => {
        if (keyword.length < STUDIO_SEARCH_MIN_LENGTH) {
            setStudioSearch(undefined);
            return;
        }

        setStudioSearch(keyword);
    };

    const form = useTypedAppFormContext({ defaultValues: {} as never });
    return (
        <form.AppField
            name={'studios' as never}
            children={() => (
                <SelectField
                    {...props}
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
                </SelectField>
            )}
        />
    );
};

export default Studio;
