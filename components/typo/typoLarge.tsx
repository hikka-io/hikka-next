import {TTypoProps} from "./type";

const typoLarge = ({children, className, ...props}: TTypoProps) => {
    return (
        <div className={`text-lg font-semibold ${className}`} {...props}>
            {children}
        </div>
    );
};

export default typoLarge;
