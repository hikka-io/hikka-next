import type { SVGProps } from 'react';

export function CustomUserLinkMikai(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            {...props}
        >
            <clipPath id="CustomUserLinkMikaiClip">
                <rect width="24" height="24" rx="6" />
            </clipPath>
            <image
                width="24"
                height="24"
                href="/icons/platforms/mikai.png"
                clipPath="url(#CustomUserLinkMikaiClip)"
            />
        </svg>
    );
}
export default CustomUserLinkMikai;
