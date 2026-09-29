import type { FC, ReactNode } from 'react';
import { useState } from 'react';

type Props = {
    children: ReactNode;
};

const SpoilerInline: FC<Props> = ({ children }) => {
    const [revealed, setRevealed] = useState(false);

    if (revealed) {
        return <span className="spoiler-inline">{children}</span>;
    }

    return (
        // biome-ignore lint/a11y/useSemanticElements: a real button cannot hold the link the spoiler text may contain.
        <span
            role="button"
            tabIndex={0}
            aria-label="Показати спойлер"
            className="spoiler-inline cursor-pointer select-none rounded-xs bg-secondary/60 px-1.5 blur-[3px]"
            onClick={(event) => {
                event.stopPropagation();
                setRevealed(true);
            }}
            onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                event.stopPropagation();
                setRevealed(true);
            }}
        >
            {children}
        </span>
    );
};

export default SpoilerInline;
