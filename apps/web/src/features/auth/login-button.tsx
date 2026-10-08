import { Button, type ButtonProps } from '@/components/ui/button';
import { Link, useCurrentUrl } from '@/utils/navigation';

const LoginButton = (props: ButtonProps) => {
    const currentUrl = useCurrentUrl();

    return (
        <Button
            size="md"
            variant="ghost"
            {...props}
            render={<Link to="/login" search={{ callbackUrl: currentUrl }} />}
        >
            Увійти
        </Button>
    );
};

export default LoginButton;
