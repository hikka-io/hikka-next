import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/hooks/use-session';
import { NotificationsMenu } from '@/features/notifications';
import { SearchModal } from '@/features/search';
import useScrollTrigger from '@/services/hooks/use-scroll-trigger';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

import LoginButton from '../login-button';
import NavMenu from './components/nav-menu';
import ProfileMenu from './components/profile-menu';

const Navbar = () => {
    const { user: loggedUser } = useSession();

    const trigger = useScrollTrigger({
        threshold: 40,
        disableHysteresis: true,
    });

    return (
        <header
            className={cn(
                'sticky top-0 z-10 hidden w-full border-b border-b-transparent bg-transparent backdrop-blur transition-[background-color,border-color,backdrop-filter] md:block',
                trigger &&
                    'border-b-border bg-background/80 backdrop-blur-xl backdrop-saturate-150',
            )}
        >
            <nav className="relative mx-auto flex min-h-16 w-full max-w-350 items-center gap-8 px-4">
                <div className="flex min-w-0 flex-1 items-center gap-6">
                    <Link
                        className="logo h-6 w-20 shrink-0"
                        to="/"
                        onClick={() => {
                            if (window.location.pathname === '/') {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }}
                    />

                    <div className="flex min-w-0 flex-1">
                        <NavMenu />
                    </div>
                </div>
                <div className="flex gap-2">
                    <SearchModal />
                    {loggedUser ? (
                        <div className="flex items-center gap-2">
                            <NotificationsMenu />
                            <ProfileMenu />
                        </div>
                    ) : (
                        <>
                            <LoginButton />
                            <Button
                                size="md"
                                className="hidden lg:flex"
                                asChild
                            >
                                <Link to="/signup">Реєстрація</Link>
                            </Button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
