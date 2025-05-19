export default function Sidebar() {
    return (
        <div className="w-60 bg-gray-800 text-white p-4">
            <h2 className="text-xl font-bold">Quản trị hệ thống</h2>
            <ul className="mt-4">
                <li className="mb-2" >
                    <a href="/admin/categories" className="block py-2">Nhóm sản phẩm</a>
                </li>
                <li className="mb-2" >
                    <a href="/admin/categories" className="block py-2">Sản phẩm</a>
                </li>
            </ul>
        </div>
    )
}