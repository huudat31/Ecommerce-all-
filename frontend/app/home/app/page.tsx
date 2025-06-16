"use client";
import React from 'react';
import { Users, Package, ShoppingCart, TrendingUp, DollarSign, Activity } from 'lucide-react';

export default function HomePage() {
    const stats = [
        {
            name: 'Tổng người dùng',
            value: '2,651',
            change: '+4.75%',
            changeType: 'positive',
            icon: Users,
        },
        {
            name: 'Tổng sản phẩm',
            value: '1,423',
            change: '+2.02%',
            changeType: 'positive',
            icon: Package,
        },
        {
            name: 'Đơn hàng tháng này',
            value: '892',
            change: '+12.5%',
            changeType: 'positive',
            icon: ShoppingCart,
        },
        {
            name: 'Doanh thu',
            value: '₫245,670,000',
            change: '+8.2%',
            changeType: 'positive',
            icon: DollarSign,
        },
    ];

    const recentActivities = [
        { id: 1, user: 'Nguyễn Văn A', action: 'đã tạo đơn hàng mới', time: '2 phút trước' },
        { id: 2, user: 'Trần Thị B', action: 'đã cập nhật thông tin sản phẩm', time: '5 phút trước' },
        { id: 3, user: 'Lê Văn C', action: 'đã đăng ký tài khoản', time: '10 phút trước' },
        { id: 4, user: 'Phạm Thị D', action: 'đã hủy đơn hàng', time: '15 phút trước' },
        { id: 5, user: 'Hoàng Văn E', action: 'đã thanh toán đơn hàng', time: '20 phút trước' },
    ];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Trang chủ</h1>
                <p className="text-gray-600 mt-2">Chào mừng bạn đến với bảng điều khiển quản trị</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="bg-white rounded-xl shadow-sm border p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <Icon className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {stat.change}
                                </span>
                                <span className="text-sm text-gray-500 ml-2">so với tháng trước</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
                        <Activity className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Users className="h-4 w-4 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-900">
                                            <span className="font-medium">{activity.user}</span> {activity.action}
                                        </p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Thao tác nhanh</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                            <Users className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm font-medium text-gray-700">Thêm người dùng</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                            <Package className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm font-medium text-gray-700">Thêm sản phẩm</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                            <ShoppingCart className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm font-medium text-gray-700">Xem đơn hàng</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                            <TrendingUp className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm font-medium text-gray-700">Xem báo cáo</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}