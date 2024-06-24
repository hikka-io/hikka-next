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

import useReadList from '@/services/hooks/read/use-read-list';
import { READ_STATUS } from '@/utils/constants';
import createQueryString from '@/utils/create-query-string';

const StatusCombobox = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const params = useParams();
    const router = useRouter();

    const readStatus = searchParams.get('status')! as API.ReadStatus;

    const { pagination } = useReadList({
        content_type: params.content_type as 'manga' | 'novel',
        username: String(params.username),
        read_status: String(readStatus) as API.ReadStatus,
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
        <Select value={[readStatus]} onValueChange={handleWatchStatusChange}>
            <SelectTrigger>
                <div className="flex items-center gap-4">
                    <div className="hidden rounded-md border border-secondary bg-secondary/60 p-1 sm:block">
                        {createElement(READ_STATUS[readStatus].icon!)}
                    </div>
                    <div className="flex items-center gap-2">
                        <H5>{READ_STATUS[readStatus].title_ua}</H5>
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
                        {(Object.keys(READ_STATUS) as API.ReadStatus[]).map(
                            (o) => (
                                <SelectItem key={o} value={o}>
                                    {READ_STATUS[o].title_ua}
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
