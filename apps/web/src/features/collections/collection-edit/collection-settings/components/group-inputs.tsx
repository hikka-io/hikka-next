import { type FC, useState } from 'react';

import {
    DragDropProvider,
    type DragEndEvent,
    PointerSensor,
} from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import { useShallow } from 'zustand/shallow';

import { createDragDropManager } from '@/utils/drag-drop-manager';

import {
    useCollectionContext,
    useCollectionStore,
} from '../../collection-provider';
import SortableInput from './sortable-input';

const SENSORS = [
    PointerSensor.configure({ activationConstraints: () => undefined }),
];

type GroupTitleInputProps = {
    groupId: string;
    index: number;
};

const GroupTitleInput: FC<GroupTitleInputProps> = ({ groupId, index }) => {
    const title = useCollectionContext(
        (state) => state.groups.find((g) => g.id === groupId)?.title ?? '',
    );
    const updateGroupTitle = useCollectionContext(
        (state) => state.updateGroupTitle,
    );
    const removeGroup = useCollectionContext((state) => state.removeGroup);

    return (
        <SortableInput
            placeholder="Введіть назву"
            value={title}
            id={groupId}
            index={index}
            className="flex-1"
            onChange={(e) => updateGroupTitle(groupId, e.target.value)}
            onRemove={() => removeGroup(groupId)}
        />
    );
};

const GroupInputs = () => {
    const store = useCollectionStore();
    const [manager] = useState(() =>
        createDragDropManager({ sensors: SENSORS }),
    );
    const groupIds = useCollectionContext(
        useShallow((state) => state.groups.map((group) => group.id)),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { source } = event.operation;
        if (event.canceled || !isSortable(source)) return;

        const { groups, reorderGroups } = store.getState();
        const activeIndex = groups.findIndex((g) => g.id === source.id);
        const overIndex = source.sortable.index;

        if (activeIndex !== -1 && activeIndex !== overIndex) {
            reorderGroups(activeIndex, overIndex);
        }
    };

    return (
        <DragDropProvider manager={manager} onDragEnd={handleDragEnd}>
            {groupIds.map((groupId, index) => (
                <GroupTitleInput
                    key={groupId}
                    groupId={groupId}
                    index={index}
                />
            ))}
        </DragDropProvider>
    );
};

export default GroupInputs;
