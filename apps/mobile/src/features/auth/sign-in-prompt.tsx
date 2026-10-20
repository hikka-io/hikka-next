import type { FC } from 'react';

import { Link } from 'expo-router';
import { LogIn, type LucideIcon } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';

type Props = {
    description: string;
    icon?: LucideIcon;
    // `page` fills a signed-out screen, `section` replaces one block of a screen.
    variant?: 'page' | 'section';
    className?: string;
};

/** What a guest sees instead of signed-in content: the web's "Ви не авторизовані" with a login button. */
const SignInPrompt: FC<Props> = ({
    description,
    icon = LogIn,
    variant = 'page',
    className,
}) => {
    const section = variant === 'section';

    return (
        <EmptyState
            size={section ? 'sm' : 'md'}
            bordered={section}
            icon={<Icon as={icon} />}
            title="Ви не авторизовані"
            description={description}
            action={
                <Link href="/login" asChild>
                    <Button size={section ? 'md' : 'default'}>Увійти</Button>
                </Link>
            }
            className={cn(
                !section && 'flex-1 justify-center bg-background',
                className,
            )}
        />
    );
};

export default SignInPrompt;
