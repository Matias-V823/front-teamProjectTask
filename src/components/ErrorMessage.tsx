const ErrorMessage = ({children} : {children: React.ReactNode}) => {
  return (
    <div className="text-center my-4 text-red-500 font-bold p-2 uppercase text-sm">
        {children}
    </div>
  )
}
export default ErrorMessage