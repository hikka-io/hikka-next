import type { FC } from 'react';

import type { ContentTypeEnum } from '@hikka/api';

import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';
import ClearFiltersFooter from '@/features/filters/clear-filters-footer';

import { TodoFiltersBody, type TodoFiltersValue } from './todo-filters';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contentType: ContentTypeEnum;
    value: TodoFiltersValue;
    onChange: (value: TodoFiltersValue) => void;
};

const TodoFiltersModal: FC<Props> = ({
    open,
    onOpenChange,
    contentType,
    value,
    onChange,
}) => {
    return (
        <ResponsiveModal
            type="sheet"
            mobile="page"
            open={open}
            onOpenChange={onOpenChange}
        >
            <ResponsiveModalContent className="md:max-w-xl" title="Фільтри">
                <TodoFiltersBody
                    className="-m-4 flex-1 overflow-hidden overflow-y-auto p-4"
                    contentType={contentType}
                    value={value}
                    onChange={onChange}
                />
                <ResponsiveModalFooter>
                    <ClearFiltersFooter
                        className="w-full"
                        preserve={['tab']}
                        onDone={() => onOpenChange(false)}
                    />
                </ResponsiveModalFooter>
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};

export default TodoFiltersModal;
