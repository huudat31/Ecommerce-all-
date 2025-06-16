import { Grid3X3, Package, ShoppingCart, Users } from "lucide-react";

export default function Sidebar({ activeComponent, setActiveComponent }: { activeComponent: string, setActiveComponent: (component: string) => void }) {
    const menuItems = [
        {
            key: "categories",
            label: "Nhóm sản phẩm",
            icon: Grid3X3,
            onClick: () => setActiveComponent("categories"),
        },
        {
            key: "products",
            label: "Sản phẩm",
            icon: Package,
            onClick: () => setActiveComponent("products"),
        },
        {
            key: "orders",
            label: "Đơn hàng",
            icon: ShoppingCart,
            onClick: () => setActiveComponent("orders"),
        },
        {
            key: "users",
            label: "Người dùng",
            icon: Users,
            onClick: () => setActiveComponent("users"),
        },

    ];

    return (
        <div className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
            <div className="p-4">
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.key}
                                onClick={item.onClick}
                                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${activeComponent === item.key
                                    ? "bg-blue-500 text-white shadow-sm"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};