import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-scree px-6 text-center">
            
            {/* 404 Number */}
            <h1 className="text-7xl font-extrabold text-white drop-shadow-lg">
                404
            </h1>

            {/* Error Message */}
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 sm:p-10 mt-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Oops! Page Not Found
                </h2>
                <p className="text-lg text-gray-600">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Back to Home Button */}
                <Link 
                    to="/" 
                    className="mt-6 inline-block px-6 py-3 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-all"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}
