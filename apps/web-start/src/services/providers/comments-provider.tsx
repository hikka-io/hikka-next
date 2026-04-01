'use client';

import { CommentResponse } from '@hikka/client';
import { ReactNode, createContext, useCallback, useContext, useState } from 'react';

interface ActiveEditor {
    type: 'reply' | 'edit';
    reference: string;
}

export interface PendingReply {
    comment: CommentResponse;
    insertAfter?: string;
}

interface CommentsContextValue {
    active: ActiveEditor | null;
    setReply: (reference: string) => void;
    setEdit: (reference: string) => void;
    clearActive: () => void;
    pendingReplies: PendingReply[];
    addPendingReply: (reply: PendingReply) => void;
    removePendingReply: (reference: string) => void;
    updatePendingReply: (reference: string, comment: CommentResponse) => void;
}

const CommentsContext = createContext<CommentsContextValue>({
    active: null,
    setReply: () => {},
    setEdit: () => {},
    clearActive: () => {},
    pendingReplies: [],
    addPendingReply: () => {},
    removePendingReply: () => {},
    updatePendingReply: () => {},
});

interface Props {
    children: ReactNode;
}

export const useCommentsContext = () => {
    return useContext(CommentsContext);
};

export default function CommentsProvider({ children }: Props) {
    const [active, setActive] = useState<ActiveEditor | null>(null);
    const [pendingReplies, setPendingReplies] = useState<PendingReply[]>([]);

    const setReply = useCallback((reference: string) => {
        setActive({ type: 'reply', reference });
    }, []);

    const setEdit = useCallback((reference: string) => {
        setActive({ type: 'edit', reference });
    }, []);

    const clearActive = useCallback(() => {
        setActive(null);
    }, []);

    const addPendingReply = useCallback((reply: PendingReply) => {
        setPendingReplies((prev) => [...prev, reply]);
    }, []);

    const removePendingReply = useCallback((reference: string) => {
        setPendingReplies((prev) =>
            prev.filter((r) => r.comment.reference !== reference),
        );
    }, []);

    const updatePendingReply = useCallback(
        (reference: string, comment: CommentResponse) => {
            setPendingReplies((prev) => {
                if (!prev.some((r) => r.comment.reference === reference))
                    return prev;
                return prev.map((r) =>
                    r.comment.reference === reference ? { ...r, comment } : r,
                );
            });
        },
        [],
    );

    return (
        <CommentsContext.Provider
            value={{
                active,
                setReply,
                setEdit,
                clearActive,
                pendingReplies,
                addPendingReply,
                removePendingReply,
                updatePendingReply,
            }}
        >
            {children}
        </CommentsContext.Provider>
    );
}
