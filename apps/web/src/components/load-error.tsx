import MaterialSymbolsWarningOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsWarningOutlineRounded';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';

type Props = {
    title: string;
    onRetry: () => void;
};

const LoadError = ({ title, onRetry }: Props) => (
    <EmptyState
        bordered
        icon={<MaterialSymbolsWarningOutlineRounded />}
        title={title}
        description="Перевірте з'єднання та спробуйте ще раз"
        action={
            <Button
                variant="outline"
                size="md"
                className="w-full lg:w-auto"
                onClick={onRetry}
            >
                Спробувати ще
            </Button>
        }
    />
);

export default LoadError;
