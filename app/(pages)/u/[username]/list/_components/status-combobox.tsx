'use client';

import { createElement } from 'react';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';

import { Combobox } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import { WATCH_STATUS } from '@/utils/constants';
import createQueryString from '@/utils/createQueryString';
import useWatchList from '@/services/hooks/watch/useWatchList';
import H3 from '@/components/typography/h3';


const Component = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const params = useParams();
    const router = useRouter();

    const watchStatus = searchParams.get('status')!;

    const { pagination } = useWatchList({
        username: String(params.username),
        watch_status: String(watchStatus) as API.WatchStatus,
    });

    return (
        <Combobox
            options={Object.keys(WATCH_STATUS).map((watchStatus) => ({
                label: WATCH_STATUS[watchStatus as API.WatchStatus].title_ua,
                value: watchStatus,
            }))}
            value={watchStatus}
            toggleProps={{ variant: 'ghost' }}
            onChange={(value) => {
                const query = createQueryString(
                    'status',
                    value as string,
                    new URLSearchParams(searchParams),
                );
                router.replace(`${pathname}?${query}`);
            }}
            renderValue={(option) =>
                !Array.isArray(option) &&
                option && (
                    <div className="flex items-center gap-4">
                        <div className="stat-figure rounded-md border border-secondary bg-secondary/60 p-1 text-xl text-base-content">
                            {createElement(
                                WATCH_STATUS[option.value as API.WatchStatus]
                                    .icon!,
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <H3>{option.label}</H3>
                            {pagination && (
                                <Label className="text-muted-foreground">
                                    ({pagination.total})
                                </Label>
                            )}
                        </div>
                    </div>
                )
            }
        />
    );
};

export default Component;
