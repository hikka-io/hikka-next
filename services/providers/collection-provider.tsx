'use client';

import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useState,
} from 'react';

import {
    Request as CollectionRequest,
    Response as CollectionResponse,
} from '@/services/api/collections/createCollection';

export type Item = {
    id: string | number;
    content: API.Anime | API.Character | API.Person;
};

export type Group = {
    id: string | number;
    title: string | null;
    items: Item[];
    isGroup: boolean;
};

export interface State {
    title: string;
    description: string;
    content_type: API.ContentType;
    groups: Group[];
    nsfw: boolean;
    spoiler: boolean;
    visibility: 'private' | 'public' | 'unlisted';
    tags: string[];
}

interface ContextProps extends State {
    setState?: Dispatch<SetStateAction<State>>;
    stateToCreate?: () => CollectionRequest;
    rawToState?: (raw: CollectionResponse) => State;
}

const CollectionContext = createContext<ContextProps>(getInitialState());

interface Props {
    children: ReactNode;
}

function getInitialState(): State {
    return {
        title: '',
        description: '',
        content_type: 'anime',
        nsfw: false,
        spoiler: false,
        visibility: 'public',
        tags: [],
        groups: [
            {
                id: String(Date.now()),
                title: null,
                isGroup: false,
                items: [],
            },
        ],
    };
}

export const useCollectionContext = () => {
    return useContext(CollectionContext);
};

export default function CollectionProvider({ children }: Props) {
    const [state, setState] = useState<State>(getInitialState());

    const contentToArray = () => {
        return state.groups
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
    };

    const stateToCreate = (): CollectionRequest => {
        return {
            title: state.title,
            description: state.description,
            content_type: state.content_type,
            nsfw: state.nsfw,
            spoiler: state.spoiler,
            visibility: state.visibility,
            labels_order: state.groups
                .map((group) => group.title || '')
                .filter((title) => title !== ''),
            content: contentToArray(),
            tags: state.tags,
            auth: '',
        };
    };

    const rawToState = (raw: CollectionResponse) => {
        const groups = raw.collection.reduce((acc: Group[], item) => {
            const group = acc.find((g) => g.title === item.label);
            if (group) {
                group.items.push({
                    id: item.content.slug,
                    content: item.content,
                });
            } else {
                acc.push({
                    id: item.label || String(Date.now()),
                    title: item.label,
                    isGroup: item.label !== null && item.label !== '',
                    items: [
                        {
                            id: item.content.slug,
                            content: item.content,
                        },
                    ],
                });
            }
            return acc;
        }, []);

        return {
            title: raw.title,
            description: raw.description,
            content_type: raw.content_type,
            nsfw: raw.nsfw,
            spoiler: raw.spoiler,
            visibility: raw.visibility,
            groups: groups,
            tags: raw.tags,
        };
    };

    return (
        <CollectionContext.Provider
            value={{
                ...state,
                setState,
                stateToCreate,
                rawToState,
            }}
        >
            {children}
        </CollectionContext.Provider>
    );
}
