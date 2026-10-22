import { type FC, Suspense } from 'react';

import { Separator } from '@/components/ui/separator';
import { FLUSH_SURFACE_CLASS_NAME } from '@/components/ui/surface';
import {
    FiltersButton,
    type RenderFiltersModal,
    SearchInput,
    Sort,
} from '@/features/filters';
import { cn } from '@/utils/cn';

import type { TodoContentType } from './use-todo-content-list';
import { getTodoSortType } from './use-todo-filters';

type Props = {
    contentType: TodoContentType;
    renderFilterModal: RenderFiltersModal;
    className?: string;
};

const TodoContentNavbar: FC<Props> = ({
    contentType,
    renderFilterModal,
    className,
}) => {
    return (
        <div
            className={cn(
                'flex flex-col gap-4 p-4 md:flex-row md:items-center',
                FLUSH_SURFACE_CLASS_NAME,
                className,
            )}
        >
            <div className="min-w-0 flex-1">
                <Suspense>
                    <SearchInput placeholder="Пошук..." />
                </Suspense>
            </div>

            <Separator orientation="vertical" className="hidden h-6 md:block" />

            <div className="flex items-center gap-4">
                <Sort
                    sort_type={getTodoSortType(contentType)}
                    compact
                    className="min-w-0 flex-1 overflow-hidden md:w-46"
                    placeholder="Сортування"
                />

                <Separator orientation="vertical" className="h-6 lg:hidden" />

                <FiltersButton
                    className="lg:hidden"
                    renderModal={renderFilterModal}
                />
            </div>
        </div>
    );
};

export default TodoContentNavbar;
