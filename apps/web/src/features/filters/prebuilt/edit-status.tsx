'use client';

import { EditStatusEnum } from '@hikka/client';
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

import { EDIT_STATUS } from '@/utils/constants/edit';

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
        <CollapsibleFilter defaultOpen title="Статус" active={!!edit_status}>
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
                            {(Object.keys(EDIT_STATUS) as EditStatusEnum[]).map(
                                (item) => (
                                    <SelectItem key={item} value={item}>
                                        {EDIT_STATUS[item].title_ua}
                                    </SelectItem>
                                ),
                            )}
                        </SelectGroup>
                    </SelectList>
                </SelectContent>
            </Select>
        </CollapsibleFilter>
    );
};

export default EditStatus;
