import { GetEditListArgs, TodoEditArgs } from '@hikka/client';

export interface UseEditParams {
    editId: number | string;
}

export interface UseEditListParams {
    args?: GetEditListArgs;
}

export interface UseTodoEditListParams {
    args: TodoEditArgs;
}
