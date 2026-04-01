'use client';

import { arrayMove } from '@dnd-kit/sortable';
import {
    CollectionArgs,
    CollectionContent,
    CollectionContentType,
    CollectionResponse,
    CollectionVisibilityEnum,
    ContentTypeEnum,
} from '@hikka/client';
import { createStore } from 'zustand';

export type Item = {
    id: string | number;
    content: CollectionContent & { title?: string };
    comment?: string;
};

export type Group = {
    id: string;
    title: string | null;
    items: Item[];
};

export type CollectionState = {
    title?: string;
    description?: string;
    content_type: CollectionContentType;
    groups: Group[];
    nsfw: boolean;
    spoiler: boolean;
    visibility: CollectionVisibilityEnum;
    tags: string[];
};

export type CollectionActions = {
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    setTags: (tags: string[]) => void;
    setContentType: (content_type: CollectionContentType) => void;
    setNsfw: (nsfw: boolean) => void;
    setSpoiler: (spoiler: boolean) => void;
    setVisibility: (visibility: CollectionVisibilityEnum) => void;

    // Group actions
    setGroups: (groups: Group[]) => void;
    addGroup: () => void;
    removeGroup: (groupId: string) => void;
    updateGroupTitle: (groupId: string, title: string) => void;
    reorderGroups: (activeIndex: number, overIndex: number) => void;

    // Item actions
    addItem: (
        groupId: string,
        content: CollectionContent & { title?: string },
    ) => void;
    removeItem: (groupId: string, itemId: string | number) => void;
    updateItemComment: (
        groupId: string,
        itemId: string | number,
        comment: string,
    ) => void;

    // DnD actions (use get() internally — no stale closures)
    moveItemToGroup: (
        itemId: string | number,
        fromGroupId: string,
        toGroupId: string,
        insertIndex: number,
    ) => void;
    reorderItem: (
        groupId: string,
        activeIndex: number,
        overIndex: number,
    ) => void;

    // API serialization
    setApiData: (data: CollectionResponse<CollectionContent>) => void;
    getApiData: () => CollectionArgs;
};

export type CollectionStore = CollectionState & CollectionActions;

function updateGroup(
    groups: Group[],
    groupId: string,
    updater: (group: Group) => Group,
): Group[] {
    return groups.map((g) => (g.id === groupId ? updater(g) : g));
}

export const createCollectionStore = (initProps?: Partial<CollectionState>) => {
    const DEFAULT_PROPS: CollectionState = {
        title: undefined,
        description: undefined,
        content_type: ContentTypeEnum.ANIME,
        groups: [
            {
                id: crypto.randomUUID(),
                title: null,
                items: [],
            },
        ],
        nsfw: false,
        spoiler: false,
        visibility: CollectionVisibilityEnum.PRIVATE,
        tags: [],
    };
    return createStore<CollectionStore>()((set, get) => ({
        ...DEFAULT_PROPS,
        ...initProps,
        setTitle: (title) => set({ title }),
        setDescription: (description) => set({ description }),
        setTags: (tags) => set({ tags }),
        setContentType: (content_type) => set({ content_type }),
        setNsfw: (nsfw) => set({ nsfw }),
        setSpoiler: (spoiler) => set({ spoiler }),
        setVisibility: (visibility) => set({ visibility }),
        setGroups: (groups) => set({ groups }),

        addGroup: () => {
            const { groups } = get();
            const newGroup: Group = {
                id: crypto.randomUUID(),
                title: '',
                items: [],
            };

            if (groups.length === 1 && groups[0].title === null) {
                // Convert the ungrouped container into a labeled group
                set({
                    groups: [{ ...groups[0], title: '' }],
                });
            } else {
                set({ groups: [...groups, newGroup] });
            }
        },

        removeGroup: (groupId) => {
            const { groups } = get();
            if (groups.length === 1 && groups[0].title !== null) {
                // Last labeled group — convert back to ungrouped
                set({
                    groups: [{ ...groups[0], title: null }],
                });
                return;
            }

            const removed = groups.find((g) => g.id === groupId);
            const remaining = groups.filter((g) => g.id !== groupId);

            // Redistribute items to first remaining group
            if (removed && removed.items.length > 0 && remaining.length > 0) {
                remaining[0] = {
                    ...remaining[0],
                    items: [...remaining[0].items, ...removed.items],
                };
            }

            set({ groups: remaining });
        },

        updateGroupTitle: (groupId, title) => {
            set({
                groups: updateGroup(get().groups, groupId, (g) => ({
                    ...g,
                    title,
                })),
            });
        },

        reorderGroups: (activeIndex, overIndex) => {
            set({ groups: arrayMove(get().groups, activeIndex, overIndex) });
        },

        addItem: (groupId, content) => {
            const { groups } = get();
            const isDuplicate = groups.some((g) =>
                g.items.some((item) => item.content.slug === content.slug),
            );
            if (isDuplicate) return;

            set({
                groups: updateGroup(groups, groupId, (g) => ({
                    ...g,
                    items: [...g.items, { id: content.slug, content }],
                })),
            });
        },

        removeItem: (groupId, itemId) => {
            set({
                groups: updateGroup(get().groups, groupId, (g) => ({
                    ...g,
                    items: g.items.filter((item) => item.id !== itemId),
                })),
            });
        },

        updateItemComment: (groupId, itemId, comment) => {
            set({
                groups: updateGroup(get().groups, groupId, (g) => ({
                    ...g,
                    items: g.items.map((item) =>
                        item.id === itemId ? { ...item, comment } : item,
                    ),
                })),
            });
        },

        moveItemToGroup: (itemId, fromGroupId, toGroupId, insertIndex) => {
            const { groups } = get();
            const fromGroup = groups.find((g) => g.id === fromGroupId);
            if (!fromGroup) return;

            const item = fromGroup.items.find((i) => i.id === itemId);
            if (!item) return;

            set({
                groups: groups.map((g) => {
                    if (g.id === fromGroupId) {
                        return {
                            ...g,
                            items: g.items.filter((i) => i.id !== itemId),
                        };
                    }
                    if (g.id === toGroupId) {
                        const newItems = [...g.items];
                        newItems.splice(insertIndex, 0, item);
                        return { ...g, items: newItems };
                    }
                    return g;
                }),
            });
        },

        reorderItem: (groupId, activeIndex, overIndex) => {
            set({
                groups: updateGroup(get().groups, groupId, (g) => ({
                    ...g,
                    items: arrayMove(g.items, activeIndex, overIndex),
                })),
            });
        },

        setApiData: (data) => {
            const groups = data.collection.reduce<Group[]>((acc, item) => {
                let group = acc.find((g) => g.title === item.label);
                if (!group) {
                    group = {
                        id: item.label || 'default',
                        title: item.label,
                        items: [],
                    };
                    acc.push(group);
                }
                group.items.push({
                    id: item.content.slug,
                    content: item.content,
                    comment: item.comment ?? undefined,
                });
                return acc;
            }, []);

            set({
                title: data.title,
                description: data.description,
                content_type: data.content_type,
                groups,
                nsfw: data.nsfw,
                spoiler: data.spoiler,
                visibility: data.visibility,
                tags: data.tags,
            });
        },

        getApiData: () => {
            const state = get();
            let order = 0;
            const content = state.groups.flatMap((group) =>
                group.items.map((item) => ({
                    comment: item.comment || undefined,
                    label: group.title || undefined,
                    order: ++order,
                    slug: item.content.slug,
                })),
            );

            return {
                title: state.title!,
                description: state.description!,
                content_type: state.content_type,
                nsfw: state.nsfw,
                spoiler: state.spoiler,
                visibility: state.visibility,
                labels_order: state.groups
                    .map((g) => g.title || '')
                    .filter(Boolean),
                content,
                tags: state.tags,
            };
        },
    }));
};
