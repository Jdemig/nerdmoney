
type ButtonPropTypes = {
    className?: string
    onClick?: (e: any) => void
    children?: any
}

export default function Button({ className, onClick, children }: ButtonPropTypes) {
    return (
        <button
            type="button"
            className={`${className} bg-primary text-white rounded-lg py-2 px-3`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
