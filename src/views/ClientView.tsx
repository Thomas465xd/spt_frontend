export default function ClientView() {
    return (
        <>
            <h1 className="text-3xl font-bold">Nuestros Productos</h1>

            <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Producto 1</h2>
                    <p>Descripción del producto 1</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Producto 2</h2>
                    <p>Descripción del producto 2</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Producto 3</h2>
                    <p>Descripción del producto 3</p>
                </div>
            </div>
        </>
    )
}
