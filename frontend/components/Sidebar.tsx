import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";

export default function Sidebar() {
    return (
        <div className="w-1/5 bg-white border-r border-gray-200 shadow h-screen p-4">
            <div className="flex flex-col items-start h-full">
                <h1 className="text-xl font-semibold text-gray-800 mb-6 self-center">
                    Admin
                </h1>
                <ul className="space-y-2 w-full">
                    <li>
                        <a
                            href="/admin/categories"
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Nhóm sản phẩm
                        </a>
                    </li>
                    <li>
                        <a
                            href="/admin/products"
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        >
                            <Package className="w-5 h-5" />
                            Sản phẩm
                        </a>
                    </li>
                    <li>
                        <a
                            href="/admin/orders"
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Đơn hàng
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
