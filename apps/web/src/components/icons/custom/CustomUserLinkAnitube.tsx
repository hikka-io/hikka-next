import type { SVGProps } from 'react';

export function CustomUserLinkAnitube(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 1.8a8.2 8.2 0 1 1 0 16.4 8.2 8.2 0 0 1 0-16.4ZM9.8 8.3 16 12l-6.2 3.7Z"
            />
        </svg>
    );
}
export default CustomUserLinkAnitube;
