import { type FC, Suspense } from 'react';

import { Separator } from '@/components/ui/separator';
import SearchInput from '@/features/filters/search-input';
import Sort from '@/features/filters/sort';
import { cn } from '@/utils/cn';

import type { TodoContentType } from '../hooks/use-todo-content-list';
import { getTodoSortType } from '../hooks/use-todo-filters';

type Props = {
    value: TodoContentType;
    className?: string;
};

const TodoContentNavbar: FC<Props> = ({ value, className }) => {
    return (
        <div
            className={cn(
                'surface -mx-4 flex flex-col gap-4 rounded-none border border-x-0 p-4 md:mx-0 md:flex-row md:items-center md:rounded-md md:border-x',
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
                    sort_type={getTodoSortType(value)}
                    compact
                    className="min-w-0 flex-1 overflow-hidden md:w-46"
                    placeholder="Сортування"
                />

                <Separator orientation="vertical" className="h-6" />
            </div>
        </div>
    );
};

export default TodoContentNavbar;
