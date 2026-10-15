import type { SVGProps } from 'react';

export function CustomUserLinkZenko(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            {...props}
        >
            <clipPath id="CustomUserLinkZenkoClip">
                <rect width="24" height="24" rx="6" />
            </clipPath>
            <image
                width="24"
                height="24"
                href="/icons/platforms/user-link-zenko.png"
                clipPath="url(#CustomUserLinkZenkoClip)"
            />
        </svg>
    );
}
export default CustomUserLinkZenko;
