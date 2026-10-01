import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { usePathname } from '@/utils/navigation';

import { SEARCH_ENTITIES } from '../search-entities';
import type { SearchEntityType, SearchResult, SearchTypeValue } from '../types';

type Props = {
    open: boolean;
    onClick?: (content: SearchResult) => void;
    setOpen: (open: boolean) => void;
    setSearchType?: Dispatch<SetStateAction<SearchTypeValue>>;
    content_type?: SearchEntityType;
    disableHotkey?: boolean;
};

const useSearchModal = ({
    onClick,
    open,
    setOpen,
    setSearchType,
    content_type,
    disableHotkey,
}: Props) => {
    const pathname = usePathname();

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const _focused = document.activeElement;

            const _inputting =
                _focused?.tagName.toLowerCase() === 'textarea' ||
                _focused?.tagName.toLowerCase() === 'input' ||
                _focused?.role === 'textbox';

            if (!_inputting && e.key === '/') {
                e.preventDefault();
                setOpen(!open);
            }
        }

        if (!onClick && !disableHotkey) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClick, setOpen, open, disableHotkey]);

    useEffect(() => {
        if (setSearchType && content_type) {
            setSearchType(content_type);
        }
    }, [content_type, setSearchType]);

    useEffect(() => {
        if (!open || content_type || !setSearchType) return;

        const currentPageEntity = SEARCH_ENTITIES.find(
            ({ routePrefix }) =>
                pathname === routePrefix ||
                pathname.startsWith(`${routePrefix}/`),
        );

        if (currentPageEntity) {
            setSearchType(currentPageEntity.type);
        }
    }, [open, content_type, pathname, setSearchType]);
};

export default useSearchModal;
