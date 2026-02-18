import { AnimeResponse, ContentTypeEnum } from '@hikka/client';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';

import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props {
    open: boolean;
    onClick?: (anime: AnimeResponse) => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    setSearchType?: Dispatch<SetStateAction<ContentTypeEnum>>;
    content_type?: ContentTypeEnum;
}

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
    }, [onClick]);

    useEffect(() => {
        if (setSearchType && content_type) {
            setSearchType(content_type);
        }
    }, [content_type]);

    useEffect(() => {
        if (open) {
            const currentPageContentType = ALLOWED_SEARCH_TYPES.find((ct) =>
                pathname.startsWith(CONTENT_TYPE_LINKS[ct as ContentTypeEnum]),
            );

            if (currentPageContentType) {
                setSearchType!(currentPageContentType as ContentTypeEnum);
            }
        }
    }, [open]);
};

export default useSearchModal;
