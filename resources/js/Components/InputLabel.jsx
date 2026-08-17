export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-semibold text-heading ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
