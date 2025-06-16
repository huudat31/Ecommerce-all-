"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Users,
    Settings,
    Home,
    BarChart3,
    Package,
    ShoppingCart,
    FileText,
    Menu
} from 'lucide-react';

const menuItems = [
    { name: 'Trang chủ', href: '/', icon: Home },
    { name: 'Người dùng', href: '/users', icon: Users },
    { name: 'Sản phẩm', href: '/products', icon: Package },
    { name: 'Đơn hàng', href: '/orders', icon: ShoppingCart },
    { name: 'Báo cáo', href: '/reports', icon: BarChart3 },
    { name: 'Tài liệu', href: '/documents', icon: FileText },
    { name: 'Cài đặt', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
            {/* Logo/Brand */}
            <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Menu className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">Admin Panel</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="mt-8 px-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">Admin User</p>
                        <p className="text-xs text-gray-500">admin@example.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}