export default function Navbar(){
    return (
        <div className="bg-grey-800 text-white p-4 flex justify-between">
            {/* Logo */}
            <div className="text-lg font-bold">
                Logo
            </div>
            <div>
                <a href="/" className="mr-4" > Trang chủ</a>
                <a href="/admin/" className="mr-4">Quản trị </a>
            </div>
        </div>
    )
}