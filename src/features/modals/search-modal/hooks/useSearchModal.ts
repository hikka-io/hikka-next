import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';

import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props {
    open: boolean;
    onClick?: (anime: API.Anime) => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    setSearchType?: Dispatch<SetStateAction<API.ContentType | 'user'>>;
    content_type?: API.ContentType | 'user';
}

const ALLOWED_SEARCH_TYPES: (API.ContentType | 'user')[] = [
    'anime',
    'manga',
    'novel',
    'character',
    'person',
    'user',
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
    }, [onClick]);

    useEffect(() => {
        if (setSearchType && content_type) {
            setSearchType(content_type);
        }
    }, [content_type]);

    useEffect(() => {
        if (open) {
            const currentPageContentType = ALLOWED_SEARCH_TYPES.find((ct) =>
                pathname.startsWith(CONTENT_TYPE_LINKS[ct as API.ContentType]),
            );

            if (currentPageContentType) {
                setSearchType!(currentPageContentType as API.ContentType);
            }
        }
    }, [open]);
};

export default useSearchModal;
