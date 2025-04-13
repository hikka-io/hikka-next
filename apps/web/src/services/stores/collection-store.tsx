'use client';

import { createStore } from 'zustand';

import {
    Params as CollectionRequest,
    Response as CollectionResponse,
} from '../api/collections/createCollection';

export type Item = {
    id: string | number;
    content: API.MainContent & { title?: string };
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
    content_type: API.ContentType;
    groups: Group[];
    nsfw: boolean;
    spoiler: boolean;
    visibility: 'private' | 'public' | 'unlisted';
    tags: string[];
};

export type CollectionActions = {
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    setTags: (tags: string[]) => void;
    setContentType: (content_type: API.ContentType) => void;
    setNsfw: (nsfw: boolean) => void;
    setSpoiler: (spoiler: boolean) => void;
    setVisibility: (visibility: 'private' | 'public' | 'unlisted') => void;
    setGroups: (groups: Group[]) => void;
    addGroup: () => void;
    setApiData: (data: CollectionResponse) => void;
    getApiData: () => CollectionRequest;
};

export type CollectionStore = CollectionState & CollectionActions;

export const createCollectionStore = (initProps?: Partial<CollectionState>) => {
    const DEFAULT_PROPS: CollectionState = {
        title: undefined,
        description: undefined,
        content_type: 'anime',
        groups: [],
        nsfw: false,
        spoiler: false,
        visibility: 'private',
        tags: [],
    };
    return createStore<CollectionStore>()((set, get) => ({
        ...DEFAULT_PROPS,
        ...initProps,
        setTitle: (title: string) => set({ title }),
        setDescription: (description: string) => set({ description }),
        setTags: (tags: string[]) => set({ tags }),
        setContentType: (content_type: API.ContentType) =>
            set({ content_type }),
        setNsfw: (nsfw: boolean) => set({ nsfw }),
        setSpoiler: (spoiler: boolean) => set({ spoiler }),
        setVisibility: (visibility: 'private' | 'public' | 'unlisted') =>
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
        setApiData: (data: API.Collection<API.MainContent>) => {
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
                            comment: null,
                            label: group.title || null,
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
