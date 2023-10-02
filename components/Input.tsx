
type InputPropTypes = {
    type?: string
    className?: string
    onChange?: (e: any) => void
    value?: string
    placeholder?: string
}

export default function Input({ type, className, onChange, value, placeholder }: InputPropTypes) {
    return (
        <input
            type={type}
            className={`${className} bg-gray-100 border-gray-200 focus:outline-none focus:border-gray-300 border-[1px] rounded-lg py-1.5 px-3`}
            onChange={onChange}
            value={value}
            placeholder={placeholder}
        />
    )
}
