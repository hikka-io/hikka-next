import type { FC } from 'react';

import { CircleAlert } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';

type Props = {
    onRetry: () => void;
};

const WidgetError: FC<Props> = ({ onRetry }) => {
    return (
        <EmptyState
            size="sm"
            bordered
            icon={<Icon as={CircleAlert} />}
            title="Не вдалося завантажити"
            action={
                <Button variant="secondary" size="md" onPress={onRetry}>
                    Повторити
                </Button>
            }
        />
    );
};

export default WidgetError;
