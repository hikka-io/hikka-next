import type { FC } from 'react';

import type { ReadContentTypeEnum as ReadContentType } from '@hikka/api';

import FiltersFooter from './filters-footer';
import FiltersModal from './filters-modal';
import { ReadFiltersBody, readPresetContentType } from './read-filters';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    content_type: ReadContentType;
    sort_type: 'manga' | 'novel' | 'read';
};

/** Controlled modal wrapper for the read filters. */
const ReadFiltersModal: FC<Props> = ({
    open,
    onOpenChange,
    content_type,
    sort_type,
}) => {
    return (
        <FiltersModal
            open={open}
            onOpenChange={onOpenChange}
            body={
                <ReadFiltersBody
                    className="-m-4 flex-1 overflow-hidden overflow-y-auto p-4"
                    content_type={content_type}
                    sort_type={sort_type}
                />
            }
            footer={
                <FiltersFooter
                    className="w-full"
                    contentType={readPresetContentType(sort_type)}
                    onDone={() => onOpenChange(false)}
                />
            }
        />
    );
};

export default ReadFiltersModal;
