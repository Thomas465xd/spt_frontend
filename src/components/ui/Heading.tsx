export default function Heading({children} : {children: React.ReactNode}) {
    return (
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center p-5 sm:px-0 mt-10 mx-0 sm:mx-32 border-b border-gray-300">
            {children}
        </h1>
    )
}