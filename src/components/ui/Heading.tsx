export default function Heading({children} : {children: React.ReactNode}) {
    return (
        <h1 className="text-4xl font-bold text-center p-5 mt-10 mx-32 border-b border-gray-300">
            {children}
        </h1>
    )
}