import type { MainContentTypeEnum } from '@hikka/api';

import { HeaderFiltersButton } from '@/features/filters';
import { useParams } from '@/utils/navigation';

import UserListFiltersModal from './user-list-filters-modal';

const UserListHeaderFilters = () => {
    const params = useParams();
    const content_type = params.content_type as MainContentTypeEnum;

    return (
        <HeaderFiltersButton
            renderModal={(props) => (
                <UserListFiltersModal content_type={content_type} {...props} />
            )}
        />
    );
};

export default UserListHeaderFilters;
