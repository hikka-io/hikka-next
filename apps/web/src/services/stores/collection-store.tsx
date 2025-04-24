'use client';

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
};

export type Group = {
    id: string | number;
    title: string | null;
    items: Item[];
    isGroup: boolean;
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
    setGroups: (groups: Group[]) => void;
    addGroup: () => void;
    setApiData: (data: CollectionResponse<CollectionContent>) => void;
    getApiData: () => CollectionArgs;
};

export type CollectionStore = CollectionState & CollectionActions;

export const createCollectionStore = (initProps?: Partial<CollectionState>) => {
    const DEFAULT_PROPS: CollectionState = {
        title: undefined,
        description: undefined,
        content_type: ContentTypeEnum.ANIME,
        groups: [],
        nsfw: false,
        spoiler: false,
        visibility: CollectionVisibilityEnum.PRIVATE,
        tags: [],
    };
    return createStore<CollectionStore>()((set, get) => ({
        ...DEFAULT_PROPS,
        ...initProps,
        setTitle: (title: string) => set({ title }),
        setDescription: (description: string) => set({ description }),
        setTags: (tags: string[]) => set({ tags }),
        setContentType: (content_type: CollectionContentType) =>
            set({ content_type }),
        setNsfw: (nsfw: boolean) => set({ nsfw }),
        setSpoiler: (spoiler: boolean) => set({ spoiler }),
        setVisibility: (visibility: CollectionVisibilityEnum) =>
            set({ visibility }),
        setGroups: (groups: Group[]) => set({ groups }),
        addGroup: () => {
            const state = get();
            const newGroup = {
                id: String(Date.now()),
                title: '',
                isGroup: true,
                items: [],
            };

            if (state.groups.length === 1 && !state.groups[0].isGroup) {
                set({
                    groups: [
                        {
                            ...state.groups[0],
                            title: '',
                            isGroup: true,
                        },
                    ],
                });
            } else {
                set({
                    groups: [...state.groups, newGroup],
                });
            }
        },
        setApiData: (data: CollectionResponse<CollectionContent>) => {
            const groups = data.collection.reduce((acc: Group[], item) => {
                let group = acc.find((g) => g.title === item.label);
                if (!group) {
                    group = {
                        id: item.label || String(Date.now()),
                        title: item.label,
                        isGroup: !!item.label,
                        items: [],
                    };
                    acc.push(group);
                }
                group.items.push({
                    id: item.content.slug,
                    content: item.content,
                });
                return acc;
            }, []);

            set({
                title: data.title,
                description: data.description,
                content_type: data.content_type,
                groups: groups,
                nsfw: data.nsfw,
                spoiler: data.spoiler,
                visibility: data.visibility,
                tags: data.tags,
            });
        },
        getApiData: () => {
            const state = get();
            const content = state.groups
                .map((group, i) => {
                    return group.items.map((item, k) => {
                        return {
                            comment: undefined,
                            label: group.title || undefined,
                            order: 0,
                            slug: item.content.slug,
                        };
                    });
                })
                .flat(1)
                .map((item, i) => ({ ...item, order: i + 1 }));

            return {
                title: state.title!,
                description: state.description!,
                content_type: state.content_type,
                nsfw: state.nsfw,
                spoiler: state.spoiler,
                visibility: state.visibility,
                labels_order: state.groups
                    .map((group) => group.title || '')
                    .filter((title) => title !== ''),
                content: content,
                tags: state.tags,
            };
        },
    }));
};
