import { Dispatch, SetStateAction, useEffect } from 'react';

interface Props {
    open: boolean;
    onClick?: (anime: API.Anime) => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    setSearchType?: Dispatch<SetStateAction<API.ContentType | 'user'>>;
    content_type?: API.ContentType | 'user';
}

const getSearchType = (value: number) => {
    switch (value) {
        case 1:
            return 'anime';
        case 2:
            return 'character';
        case 3:
            return 'person';
        case 4:
            return 'user';
        default:
            return 'anime';
    }
};

const useSearchModal = ({
    onClick,
    open,
    setOpen,
    setSearchType,
    content_type,
}: Props) => {
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
};

export default useSearchModal;
