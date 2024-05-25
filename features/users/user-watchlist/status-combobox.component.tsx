'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { createElement } from 'react';

import H5 from '@/components/typography/h5';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectIcon,
    SelectItem,
    SelectList,
    SelectTrigger,
} from '@/components/ui/select';

import useWatchList from '@/services/hooks/watch/use-watch-list';
import { WATCH_STATUS } from '@/utils/constants';
import createQueryString from '@/utils/createQueryString';

const StatusCombobox = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const params = useParams();
    const router = useRouter();

    const watchStatus = searchParams.get('status')! as API.WatchStatus;

    const { pagination } = useWatchList({
        username: String(params.username),
        watch_status: String(watchStatus) as API.WatchStatus,
    });

    const handleWatchStatusChange = (value: string[]) => {
        {
            const query = createQueryString(
                'status',
                value[0],
                new URLSearchParams(searchParams),
            );
            router.replace(`${pathname}?${query}`);
        }
    };

    return (
        <Select value={[watchStatus]} onValueChange={handleWatchStatusChange}>
            <SelectTrigger>
                <div className="flex items-center gap-4">
                    <div className="hidden rounded-md border border-secondary bg-secondary/60 p-1 sm:block">
                        {createElement(WATCH_STATUS[watchStatus].icon!)}
                    </div>
                    <div className="flex items-center gap-2">
                        <H5>{WATCH_STATUS[watchStatus].title_ua}</H5>
                        {pagination && (
                            <Label className="text-muted-foreground">
                                ({pagination.total})
                            </Label>
                        )}
                    </div>
                </div>
                <SelectIcon />
            </SelectTrigger>
            <SelectContent>
                <SelectList>
                    <SelectGroup>
                        {(Object.keys(WATCH_STATUS) as API.WatchStatus[]).map(
                            (o) => (
                                <SelectItem key={o} value={o}>
                                    {WATCH_STATUS[o].title_ua}
                                </SelectItem>
                            ),
                        )}
                    </SelectGroup>
                </SelectList>
            </SelectContent>
        </Select>
    );
};

export default StatusCombobox;
