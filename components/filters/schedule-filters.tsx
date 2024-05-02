'use client';

import * as React from 'react';
import { FC } from 'react';
import AntDesignClearOutlined from '~icons/ant-design/clear-outlined';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { range } from '@antfu/utils';

import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import useSession from '@/services/hooks/auth/useSession';
import { RELEASE_STATUS, SEASON } from '@/utils/constants';
import createQueryString from '@/utils/createQueryString';
import getCurrentSeason from '@/utils/getCurrentSeason';
import { cn } from '@/utils/utils';

const YEARS = range(2023, new Date().getFullYear() + 1).reverse();

interface Props {
    className?: string;
}

const ScheduleFilters: FC<Props> = ({ className }) => {
    const { user: loggedUser } = useSession();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const only_watch = searchParams.get('only_watch')
        ? Boolean(searchParams.get('only_watch'))
        : undefined;
    const season = searchParams.get('season') || getCurrentSeason()!;
    const year = searchParams.get('year') || String(YEARS[0]);
    const status =
        searchParams.getAll('status').length > 0
            ? searchParams.getAll('status')
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
        const query = createQueryString(
            param,
            value,
            new URLSearchParams(searchParams),
        ).toString();

        router.replace(`${pathname}?${query}`);
    };

    return (
        <div
            className={cn(
                'flex flex-col items-end gap-8 lg:flex-row lg:gap-4',
                className,
            )}
        >
            <div className="grid w-full flex-1 grid-cols-1 items-end gap-8 lg:grid-cols-4 lg:gap-4">
                <div className="flex flex-col gap-2">
                    <Label className="text-muted-foreground">Рік</Label>
                    <Combobox
                        value={year}
                        onChange={(v) => handleChangeParam('year', v)}
                        options={getYears()}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label className="text-muted-foreground">Сезон</Label>
                    <Combobox
                        value={season}
                        onChange={(v) => handleChangeParam('season', v)}
                        options={getSeasons()}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label className="text-muted-foreground">Статус</Label>
                    <Combobox
                        multiple
                        value={status}
                        onChange={(v) => handleChangeParam('status', v)}
                        options={getStatuses()}
                    />
                </div>
                {loggedUser && (
                    <div className="flex h-12 items-center justify-between gap-2 rounded-md border border-secondary bg-secondary/30 p-4">
                        <Label className="line-clamp-1 min-w-0 truncate text-muted-foreground">
                            Аніме у списку
                        </Label>
                        <Switch
                            checked={Boolean(only_watch)}
                            onCheckedChange={(checked) =>
                                handleChangeParam('only_watch', checked)
                            }
                        />
                    </div>
                )}
            </div>
            <Button variant="secondary" className="w-full lg:w-fit" asChild>
                <Link href={pathname}>
                    <AntDesignClearOutlined />
                    Очистити
                </Link>
            </Button>
        </div>
    );
};

export default ScheduleFilters;
