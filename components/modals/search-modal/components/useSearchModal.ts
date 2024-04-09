import { Dispatch, SetStateAction, useEffect } from 'react';

interface Props {
    onClick?: (anime: API.Anime) => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    setSearchType?: Dispatch<SetStateAction<API.ContentType>>;
    content_type?: API.ContentType;
}

const useSearchModal = ({
    onClick,
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
