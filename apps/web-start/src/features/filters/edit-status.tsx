import type { FC } from 'react';

import { Activity } from 'lucide-react';

import type { EditStatusEnum } from '@hikka/client';

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
import { EDIT_STATUS } from '@/utils/constants/edit';

import useChangeParam from './hooks/use-change-param';
import { useFilterSearch } from './hooks/use-filter-search';

type Props = {
    className?: string;
};

const EditStatus: FC<Props> = () => {
    const { edit_status } = useFilterSearch<{ edit_status?: string }>();

    const handleChangeParam = useChangeParam();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="size-4 shrink-0" />
                <Label>Статус</Label>
            </div>
            <Select
                value={edit_status ? [edit_status] : undefined}
                onValueChange={(value) =>
                    handleChangeParam('edit_status', value[0])
                }
            >
                <SelectTrigger size="md" className="flex-1">
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
        </div>
    );
};

export default EditStatus;
