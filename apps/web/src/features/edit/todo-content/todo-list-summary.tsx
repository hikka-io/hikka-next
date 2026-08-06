import type { FC } from 'react';

import { CatalogSummary } from '@/features/catalog';

import { useTodoContentQuery } from '../hooks/use-todo-content-query';

const TodoListSummary: FC = () => {
    const { pagination, isLoading } = useTodoContentQuery();

    return <CatalogSummary total={pagination?.total} isLoading={isLoading} />;
};

export default TodoListSummary;
