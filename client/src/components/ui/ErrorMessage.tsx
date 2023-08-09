export const ErrorMessage = ({ message }: { message: string }) => {
    return (
        <p
            className=" bg-danger-900 border border-danger-400 text-danger-400 p-3 rounded-md"
            dangerouslySetInnerHTML={{ __html: message }}
        ></p>
    )
}
