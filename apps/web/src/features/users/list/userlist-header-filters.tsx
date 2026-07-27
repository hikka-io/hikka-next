import type { MainContentTypeEnum } from '@hikka/api';

import { HeaderFiltersButton } from '@/features/filters';
import { useParams } from '@/utils/navigation';

import UserlistFiltersModal from './userlist-filters-modal';

const UserlistHeaderFilters = () => {
    const params = useParams();
    const content_type = params.content_type as MainContentTypeEnum;

    return (
        <HeaderFiltersButton
            renderModal={(props) => (
                <UserlistFiltersModal content_type={content_type} {...props} />
            )}
        />
    );
};

export default UserlistHeaderFilters;
