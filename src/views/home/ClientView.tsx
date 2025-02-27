import { Link } from 'react-router-dom';
import { Search, Tag, ShoppingCart, Clock, Heart } from 'lucide-react';

export default function ClientView() {
    return (
        <>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center p-5 sm:px-0 mt-10 mx-0 sm:mx-32 border-b border-gray-300">
                Comienza la Experiencia <br />
                <span className="text-orange-500">Portal SPT</span>
            </h1>

            <p className="text-center p-5 text-gray-700">Accede a todos los <span className='text-orange-500'>beneficios exclusivos</span> que Portal SPT te ofrece</p>

            {/* Hero Section */}
            <div className="mt-12 mb-16 px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl overflow-hidden">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left Column - Content */}
                            <div className="text-white space-y-6">
                                <h2 className="text-3xl md:text-4xl font-bold text-orange-400">Todo lo que necesitas en un solo lugar</h2>
                                <p className="text-lg text-gray-300">Descubre la forma más rápida y sencilla de encontrar los repuestos que estás buscando.</p>
                                
                                {/* Quick Search Form */}
                                <div className="mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                                    <h3 className="text-xl font-semibold mb-4">Búsqueda Rápida por SKU</h3>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Ingresa el código o SKU del producto"
                                            className="flex-grow p-3 rounded border border-gray-300 text-gray-800 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                        <button className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded flex items-center justify-center gap-2 transition-colors">
                                            <Search size={18} />
                                            <span>Buscar</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Column - Features */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/20 transform transition-transform hover:scale-105">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-orange-500 p-2 rounded-lg">
                                            <Tag size={20} className="text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Descuentos Exclusivos</h3>
                                    </div>
                                    <p className="text-gray-300 text-sm">Accede a precios especiales y promociones diseñadas específicamente para ti.</p>
                                    <Link to="/promotions" className="inline-block mt-4 text-orange-400 hover:text-orange-300 text-sm font-medium">
                                        Ver mis descuentos →
                                    </Link>
                                </div>
                                
                                <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/20 transform transition-transform hover:scale-105">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-orange-500 p-2 rounded-lg">
                                            <ShoppingCart size={20} className="text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Catálogo Completo</h3>
                                    </div>
                                    <p className="text-gray-300 text-sm">Explora nuestra amplia gama de productos y repuestos para tu negocio.</p>
                                    <Link to="/products" className="inline-block mt-4 text-orange-400 hover:text-orange-300 text-sm font-medium">
                                        Explorar productos →
                                    </Link>
                                </div>
                                
                                <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/20 transform transition-transform hover:scale-105">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-orange-500 p-2 rounded-lg">
                                            <Clock size={20} className="text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Historial de Pedidos</h3>
                                    </div>
                                    <p className="text-gray-300 text-sm">Revisa y haz seguimiento de todas tus compras y pedidos anteriores.</p>
                                    <Link to="/orders" className="inline-block mt-4 text-orange-400 hover:text-orange-300 text-sm font-medium">
                                        Ver mis pedidos →
                                    </Link>
                                </div>
                                
                                <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/20 transform transition-transform hover:scale-105">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-orange-500 p-2 rounded-lg">
                                            <Heart size={20} className="text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Favoritos</h3>
                                    </div>
                                    <p className="text-gray-300 text-sm">Guarda tus productos preferidos para acceder a ellos rápidamente.</p>
                                    <Link to="/favorites" className="inline-block mt-4 text-orange-400 hover:text-orange-300 text-sm font-medium">
                                        Mis favoritos →
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        {/* Bottom CTA */}
                        <div className="mt-12 text-center">
                            <Link to="/categories" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 shadow-lg transition-colors">
                                Explorar por categorías
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}