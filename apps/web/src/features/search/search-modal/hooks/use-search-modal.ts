import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { type AnimeResponse, ContentTypeEnum } from '@hikka/api';

import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { usePathname } from '@/utils/navigation';

import type { SearchTypeValue } from '../types';

type Props = {
    open: boolean;
    onClick?: (anime: AnimeResponse) => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    setSearchType?: Dispatch<SetStateAction<SearchTypeValue>>;
    content_type?: ContentTypeEnum;
};

const ALLOWED_SEARCH_TYPES: ContentTypeEnum[] = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
    ContentTypeEnum.CHARACTER,
    ContentTypeEnum.PERSON,
    ContentTypeEnum.USER,
];

const useSearchModal = ({
    onClick,
    open,
    setOpen,
    setSearchType,
    content_type,
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
                setOpen((prev) => !prev);
            }
        }

        if (!onClick) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClick, setOpen]);

    useEffect(() => {
        if (setSearchType && content_type) {
            setSearchType(content_type);
        }
    }, [content_type, setSearchType]);

    useEffect(() => {
        if (!open || content_type || !setSearchType) return;

        const currentPageContentType = ALLOWED_SEARCH_TYPES.find((ct) => {
            const link = CONTENT_TYPE_LINKS[ct];
            return pathname === link || pathname.startsWith(`${link}/`);
        });

        if (currentPageContentType) {
            setSearchType(currentPageContentType);
        }
    }, [open, content_type, pathname, setSearchType]);
};

export default useSearchModal;
