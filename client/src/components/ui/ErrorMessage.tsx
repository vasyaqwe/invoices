export const ErrorMessage = ({ message }: { message: string }) => {
    return (
        <p className=" bg-danger-400  text-white p-3 rounded-md">{message}</p>
    )
}
