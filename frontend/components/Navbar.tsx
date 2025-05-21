export default function Navbar() {
    return (
        <div className="flex justify-between items-center bg-gray-800 text-white p-4">
            <h1 className="text-2xl font-bold">Ecommerce</h1>
            <div className="flex space-x-4">
                <a href="/login" className="hover:underline">Login</a>
                <a href="/register" className="hover:underline">Register</a>
            </div>
        </div>
    )
}