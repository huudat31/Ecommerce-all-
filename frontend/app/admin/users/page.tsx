"use client";
import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus, X, Save, UserCheck, UserX, Phone, Mail, Lock, Badge } from "lucide-react";
import { fetchUser, createUser, updateUser, deleteUser } from "@/app/services/api";



export default function User() {
    const [users, setUsers] = useState<any[]>([]);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<string>('user');
    const [phone, setPhone] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editUserId, setEditUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    useEffect(() => {
        fetchUser().then((data) => {
            setUsers(data);
            setLoading(false);
        }).catch((error) => {
            setError(error.message);
            setLoading(false);
        })
    }, []);

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setRole('user');
        setPhone('');
        setIsActive(true);
        setIsEditing(false);
        setEditUserId(null);
        setShowForm(false);
    };
    // xử lí khi nhấn nút thêm người dùng mới
    const handleCreateUser = async () => {
        try {
            if (!name.trim()) {
                alert("Nhap ten nguoi dung");
                return;
            }
            if (!email.trim()) {
                alert("Nhap email nguoi dung");
                return;
            }
            if (!password.trim()) {
                alert("Nhap mat khau nguoi dung");
                return;
            }
            if (!phone.trim()) {
                alert("Nhap so dien thoai nguoi dung");
                return;
            }
            const newUser = await createUser({ name, email, password, role, phone, isActive });
            resetForm();
            // Refresh users list after creating
            const updatedUsers = await fetchUser();
            setUsers(updatedUsers);
        }
        catch (error) {
            console.error("Error creating user:", error);
            setError("Error creating user");
            console.log("Payload gửi đi:", {
                name,
                email,
                password,
                role,
                phone,
                isActive
            });

        }
    }
    // xử lí khi nhấn nút sửa người dùng
    const handleUpdateUser = async () => {
        if (!editUserId) return;

        try {
            if (!name.trim()) {
                alert("Nhap ten nguoi dung");
                return;
            }
            if (!email.trim()) {
                alert("Nhap email nguoi dung");
                return;
            }
            if (!password.trim()) {
                alert("Nhap mat khau nguoi dung");
                return;
            }
            if (!phone.trim()) {
                alert("Nhap so dien thoai nguoi dung");
                return;
            }
            const updatedUser = await updateUser(editUserId.toString(), { name, email, password, role, phone, isActive });
            resetForm();
            // Refresh users list after updating
            const updatedUsers = await fetchUser();
            setUsers(updatedUsers);
        } catch (error) {
            console.error("Error updating user:", error);
            setError("Error updating user");
        }
    }
    const handleEditClick = (user: any) => {
        setName(user.name);
        setEmail(user.email);

        setRole(user.role);
        setPhone(user.phone);
        setIsActive(user.isActive);
        setIsEditing(true);
        setEditUserId(user.id);
        setShowForm(true);
    }
    const handleDeleteClick = async (id: string) => {
        try {
            await deleteUser(id);
            // Refresh users list after deleting
            const updatedUsers = await fetchUser();
            setUsers(updatedUsers);
        } catch (error) {
            console.error("Error deleting user:", error);
            setError("Error deleting user");
        }
    }
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <span className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
                                <p className="text-gray-600">Quản lý thông tin và quyền truy cập của người dùng</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Thêm người dùng
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form Panel */}
                    {showForm && (
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {isEditing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                                    </h2>
                                    <button
                                        onClick={resetForm}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên người dùng
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Nhập tên người dùng"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Mail className="inline h-4 w-4 mr-1" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Nhập email"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Lock className="inline h-4 w-4 mr-1" />
                                            Mật khẩu
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Nhập mật khẩu"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Phone className="inline h-4 w-4 mr-1" />
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Badge className="inline h-4 w-4 mr-1" />
                                            Vai trò
                                        </label>
                                        <select
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="user">Người dùng</option>
                                            <option value="admin">Quản trị viên</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            checked={isActive}
                                            onChange={(e) => setIsActive(e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                                            Trạng thái hoạt động
                                        </label>
                                    </div>

                                    <button
                                        onClick={isEditing ? handleUpdateUser : handleCreateUser}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Save className="h-4 w-4" />
                                        {isEditing ? 'Cập nhật' : 'Thêm mới'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users List */}
                    <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
                        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Danh sách người dùng ({users.length})
                                </h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Người dùng
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Liên hệ
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Vai trò
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Trạng thái
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                ID: {user.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{user.email}</div>
                                                    <div className="text-sm text-gray-500">{user.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {user.isActive ? (
                                                            <>
                                                                <UserCheck className="h-3 w-3 mr-1" />
                                                                Hoạt động
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserX className="h-3 w-3 mr-1" />
                                                                Không hoạt động
                                                            </>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEditClick(user)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(user.id)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
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

                            {users.length === 0 && (
                                <div className="text-center py-12">
                                    <span className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có người dùng</h3>
                                    <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách thêm người dùng mới.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}