import { Button } from '@/components/ui/button';
import { SOCIAL_GROUP } from '@/utils/constants/navigation';

const HomeHeaderActions = () =>
    SOCIAL_GROUP.map((social) => (
        <Button
            key={social.slug}
            variant="ghost"
            size="icon-md"
            className="text-muted-foreground [&_svg]:size-5"
            aria-label={social.title_ua}
            asChild
        >
            <a href={social.url} target="_blank" rel="noopener noreferrer">
                {social.icon && <social.icon />}
            </a>
        </Button>
    ));

export default HomeHeaderActions;
