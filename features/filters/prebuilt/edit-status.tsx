'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { EDIT_STATUSES } from '@/utils/constants';

import CollapsibleFilter from '../collapsible-filter';
import useChangeParam from '../use-change-param';

interface Props {
    className?: string;
}

const EditStatus: FC<Props> = ({ className }) => {
    const searchParams = useSearchParams()!;

    const edit_status = searchParams.get('edit_status');

    const handleChangeParam = useChangeParam();

    return (
        <CollapsibleFilter defaultOpen title="Статус">
            <Select
                value={edit_status ? [edit_status] : undefined}
                onValueChange={(value) =>
                    handleChangeParam('edit_status', value[0])
                }
            >
                <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Виберіть статус..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectList>
                        <SelectGroup>
                            {(
                                Object.keys(EDIT_STATUSES) as API.EditStatus[]
                            ).map((item) => (
                                <SelectItem key={item} value={item}>
                                    {EDIT_STATUSES[item].title_ua}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectList>
                </SelectContent>
            </Select>
        </CollapsibleFilter>
    );
};

export default EditStatus;
