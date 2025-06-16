
"use client";
import { createOrder, deleteOrder, fetchOrders, updateOrder, fetchUser } from "@/app/services/api";
import { ShoppingCart, Edit, Trash2, Plus, X, User } from "lucide-react";
import { useEffect, useState } from "react";

interface Order {
    id: number;
    userId: string;
    totalAmount: number;
    totalStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

interface User {
    id: string;
    name: string;
    email: string;
}

const ORDER_STATUSES = {
    pending: { name: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
    processing: { name: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
    shipped: { name: 'Đã gửi', color: 'bg-purple-100 text-purple-800' },
    delivered: { name: 'Đã giao', color: 'bg-green-100 text-green-800' },
    cancelled: { name: 'Đã hủy', color: 'bg-red-100 text-red-800' }
};

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [userId, setUserId] = useState<string>('');
    const [totalAmount, setTotalAmount] = useState<number | string>('');
    const [totalStatus, setTotalStatus] = useState<Order['totalStatus']>('pending');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editOrderId, setEditOrderId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [ordersData, usersData] = await Promise.all([
                fetchOrders(),
                fetchUser()
            ]);
            setOrders(ordersData);
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error instanceof Error ? error.message : "Lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const loadOrders = async () => {
        try {
            setError(null);
            const data = await fetchOrders();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError(error instanceof Error ? error.message : "Lỗi khi tải đơn hàng");
        }
    };

    const resetForm = () => {
        setUserId('');
        setTotalAmount('');
        setTotalStatus('pending');
        setIsEditing(false);
        setEditOrderId(null);
        setShowForm(false);
        setError(null);
    };

    const validateForm = () => {
        if (!userId.toString().trim()) {
            setError("Người dùng không được để trống");
            return false;
        }
        if (!totalAmount || Number(totalAmount) <= 0) {
            setError("Tổng tiền phải lớn hơn 0");
            return false;
        }
        return true;
    };

    const handleCreateOrder = async () => {
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            setError(null);

            const orderData = {
                userId: userId.toString().trim(),
                totalAmount: Number(totalAmount),
                totalStatus,
                createdAt: new Date().toISOString()
            };

            await createOrder(orderData);
            resetForm();
            await loadOrders();
        } catch (error) {
            console.error("Error creating order:", error);
            setError(error instanceof Error ? error.message : "Lỗi khi tạo đơn hàng");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateOrder = async () => {
        if (!editOrderId || !validateForm()) return;

        try {
            setIsSubmitting(true);
            setError(null);

            const orderData = {
                userId: userId.toString().trim(),
                totalAmount: Number(totalAmount),
                totalStatus
            };

            await updateOrder(editOrderId.toString(), orderData);
            resetForm();
            await loadOrders();
        } catch (error) {
            console.error("Error updating order:", error);
            setError(error instanceof Error ? error.message : "Lỗi khi cập nhật đơn hàng");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteOrder = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) return;

        try {
            setError(null);
            await deleteOrder(id.toString());
            await loadOrders();
        } catch (error) {
            console.error("Error deleting order:", error);
            setError(error instanceof Error ? error.message : "Lỗi khi xóa đơn hàng");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            await handleUpdateOrder();
        } else {
            await handleCreateOrder();
        }
    };

    const handleEdit = (order: Order) => {
        setUserId(order.userId);
        setTotalAmount(order.totalAmount);
        setTotalStatus(order.totalStatus);
        setIsEditing(true);
        setEditOrderId(order.id);
        setShowForm(true);
        setError(null);
    };

    const handleAddNew = () => {
        resetForm();
        setShowForm(true);
    };

    // Helper function to get user name
    const getUserName = (userId: string) => {
        const user = users.find(u => u.id === userId);
        return user ? user.name : userId;
    };

    // Helper function to get user email
    const getUserEmail = (userId: string) => {
        const user = users.find(u => u.id === userId);
        return user ? user.email : '';
    };

    // Calculate statistics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.totalStatus === 'pending').length;
    const processingOrders = orders.filter(o => o.totalStatus === 'processing').length;
    const deliveredOrders = orders.filter(o => o.totalStatus === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.totalStatus === 'cancelled').length;
    const totalRevenue = orders.filter(o => o.totalStatus === 'delivered').reduce((sum, o) => sum + o.totalAmount, 0);

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center">
                <div className="text-gray-600">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Tạo đơn hàng mới
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Tổng đơn hàng</p>
                            <p className="text-2xl font-bold text-blue-800">{totalOrders}</p>
                        </div>
                        <ShoppingCart className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-600 text-sm font-medium">Chờ xử lý</p>
                            <p className="text-2xl font-bold text-yellow-800">{pendingOrders}</p>
                        </div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium">Đang xử lý</p>
                            <p className="text-2xl font-bold text-purple-800">{processingOrders}</p>
                        </div>
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Đã giao</p>
                            <p className="text-2xl font-bold text-green-800">{deliveredOrders}</p>
                        </div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-600 text-sm font-medium">Đã hủy</p>
                            <p className="text-2xl font-bold text-red-800">{cancelledOrders}</p>
                        </div>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-600 text-sm font-medium">Doanh thu</p>
                            <p className="text-lg font-bold text-emerald-800">{totalRevenue.toLocaleString('vi-VN')}</p>
                        </div>
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                            {isEditing ? 'Sửa đơn hàng' : 'Tạo đơn hàng mới'}
                        </h3>
                        <button
                            onClick={resetForm}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            type="button"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Người dùng *
                            </label>
                            <select
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isSubmitting}
                            >
                                <option value="">Chọn người dùng</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} - {user.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tổng tiền (VNĐ) *
                            </label>
                            <input
                                type="number"
                                value={totalAmount}
                                onChange={(e) => setTotalAmount(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0"
                                min="1"
                                step="1000"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Trạng thái
                            </label>
                            <select
                                value={totalStatus}
                                onChange={(e) => setTotalStatus(e.target.value as Order['totalStatus'])}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isSubmitting}
                            >
                                {Object.entries(ORDER_STATUSES).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-3 flex gap-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                {isSubmitting
                                    ? (isEditing ? 'Đang cập nhật...' : 'Đang tạo...')
                                    : (isEditing ? 'Cập nhật' : 'Tạo đơn hàng')
                                }
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={isSubmitting}
                                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Orders Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mã đơn hàng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Người dùng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tổng tiền
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày tạo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{order.id.toString().padStart(6, '0')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <User className="h-5 w-5 text-gray-400 mr-2" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {getUserName(order.userId)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {getUserEmail(order.userId)}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {order.totalAmount.toLocaleString('vi-VN')} VNĐ
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ORDER_STATUSES[order.totalStatus].color}`}>
                                        {ORDER_STATUSES[order.totalStatus].name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(order)}
                                            className="text-blue-600 hover:text-blue-900 transition-colors"
                                            title="Sửa đơn hàng"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOrder(order.id)}
                                            className="text-red-600 hover:text-red-900 transition-colors"
                                            title="Xóa đơn hàng"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty state */}
            {orders.length === 0 && !loading && (
                <div className="text-center py-8">
                    <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có đơn hàng nào</h3>
                    <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách tạo đơn hàng mới.</p>
                    <div className="mt-6">
                        <button
                            onClick={handleAddNew}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Tạo đơn hàng đầu tiên
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}







