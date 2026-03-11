'use client';

import { range } from '@antfu/utils';
import { useSession } from '@hikka/react';
import { useRouter } from '@tanstack/react-router';
import { FC } from 'react';

import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import { cn } from '@/utils/cn';
import { RELEASE_STATUS, SEASON } from '@/utils/constants/common';
import { getCurrentSeason } from '@/utils/season';

const YEARS = range(2023, new Date().getFullYear() + 1).reverse();

interface Props {
    className?: string;
}

interface ScheduleSearch extends Record<string, unknown> {
    only_watch?: boolean | string;
    season?: string;
    year?: string;
    status?: string[];
}

const ScheduleFilters: FC<Props> = ({ className }) => {
    const { user: loggedUser } = useSession();
    const search = useFilterSearch<ScheduleSearch>();
    const router = useRouter();

    const only_watch = search.only_watch
        ? Boolean(search.only_watch)
        : undefined;
    const season = search.season || getCurrentSeason()!;
    const year = search.year || String(YEARS[0]);
    const status =
        Array.isArray(search.status) && search.status.length > 0
            ? search.status
            : ['ongoing', 'announced'];

    const getYears = () => {
        return YEARS.map((y) => ({
            label: y,
            value: String(y),
        }));
    };

    const getSeasons = () => {
        return (Object.keys(SEASON) as Array<keyof typeof SEASON>).map((s) => ({
            label: SEASON[s].title_ua,
            value: s,
        }));
    };

    const getStatuses = () => {
        return (
            Object.keys(RELEASE_STATUS) as Array<keyof typeof RELEASE_STATUS>
        ).map((s) => ({
            label: RELEASE_STATUS[s].title_ua,
            value: s,
        }));
    };

    const handleChangeParam = (
        param: 'season' | 'year' | 'status' | 'only_watch',
        value: string | string[] | boolean,
    ) => {
        router.navigate({
            search: (prev: Record<string, unknown>) => ({
                ...prev,
                [param]: value,
            }),
            replace: true,
        } as any);
    };

    const clearFilters = () => {
        router.navigate({ search: {}, replace: true } as any);
    };

    return (
        <div
            className={cn(
                'md:mt-0" mt-4 flex flex-col items-end gap-8 lg:flex-row lg:gap-4',
                className,
            )}
        >
            <div className="grid w-full flex-1 grid-cols-1 items-end gap-8 lg:grid-cols-4 lg:gap-4">
                <div className="flex flex-col gap-2">
                    <Label className="text-muted-foreground">Рік</Label>
                    <Select
                        value={[year]}
                        onValueChange={(value) =>
                            handleChangeParam('year', value[0])
                        }
                    >
                        <SelectTrigger size="md">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectList>
                                <SelectGroup>
                                    {getYears().map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectList>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <Label className="text-muted-foreground">Сезон</Label>
                    <Select
                        value={[season]}
                        onValueChange={(value) =>
                            handleChangeParam('season', value[0])
                        }
                    >
                        <SelectTrigger size="md">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectList>
                                <SelectGroup>
                                    {getSeasons().map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectList>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <Label className="text-muted-foreground">Статус</Label>
                    <Select
                        multiple
                        value={status}
                        onValueChange={(value) =>
                            handleChangeParam('status', value)
                        }
                    >
                        <SelectTrigger size="md">
                            <SelectValue maxDisplay={1} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectList>
                                <SelectGroup>
                                    {getStatuses().map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectList>
                        </SelectContent>
                    </Select>
                </div>
                {loggedUser && (
                    <div className="flex h-10 items-center justify-between gap-2 rounded-md border bg-secondary/20 p-4 py-2">
                        <Label
                            htmlFor="only_watch"
                            className="line-clamp-1 min-w-0 truncate text-muted-foreground"
                        >
                            Аніме у списку
                        </Label>
                        <Switch
                            id="only_watch"
                            checked={Boolean(only_watch)}
                            onCheckedChange={(checked) =>
                                handleChangeParam('only_watch', checked)
                            }
                        />
                    </div>
                )}
            </div>
            <Button
                variant="destructive"
                size="md"
                className="w-full lg:w-fit"
                onClick={clearFilters}
            >
                <AntDesignClearOutlined />
                Очистити
            </Button>
        </div>
    );
};

export default ScheduleFilters;
