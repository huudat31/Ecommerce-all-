"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, LogIn } from "lucide-react";
import { login } from "@/app/services/api";


interface LoginFormData {
    username: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginFormData>({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const validateForm = (): boolean => {
        if (!formData.username.trim()) {
            setError("Tên đăng nhập không được để trống");
            return false;
        }

        if (formData.username.length < 3) {
            setError("Tên đăng nhập phải có ít nhất 3 ký tự");
            return false;
        }

        if (!formData.password.trim()) {
            setError("Mật khẩu không được để trống");
            return false;
        }

        if (formData.password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e?: React.MouseEvent) => {
        if (e) e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await login(formData.username, formData.password);


            if (response && response.data) {
                if (response.data.token) {
                    if (rememberMe) {
                        localStorage.setItem('authToken', response.data.token);
                    } else {
                        sessionStorage.setItem('authToken', response.data.token);
                    }
                }

                if (response.data.user) {
                    localStorage.setItem('userInfo', JSON.stringify(response.data.user));
                }

                router.push('/');

            } else {
                setError("Đăng nhập thất bại. Vui lòng thử lại.");
            }

        } catch (error: any) {
            console.error("Login error:", error);

            // Handle different types of errors
            if (error.response) {
                // Server responded with error status
                const status = error.response.status;
                const message = error.response.data?.message || error.response.data?.error;

                switch (status) {
                    case 401:
                        setError("Tên đăng nhập hoặc mật khẩu không chính xác");
                        break;
                    case 400:
                        setError(message || "Thông tin đăng nhập không hợp lệ");
                        break;
                    case 429:
                        setError("Đã vượt quá số lần đăng nhập. Vui lòng thử lại sau.");
                        break;
                    case 500:
                        setError("Lỗi máy chủ. Vui lòng thử lại sau.");
                        break;
                    default:
                        setError(message || "Đã xảy ra lỗi khi đăng nhập");
                }
            } else if (error.request) {
                // Network error
                setError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.");
            } else {
                // Other error
                setError("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <User className="h-8 w-8 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
                        <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <div className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên đăng nhập *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Nhập tên đăng nhập"
                                    disabled={isLoading}
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Nhập mật khẩu"
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    disabled={isLoading}
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>
                            <a
                                href="#"
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                Quên mật khẩu?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Đang đăng nhập...
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-4 w-4" />
                                    Đăng nhập
                                </>
                            )}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="text-center text-sm text-gray-600">
                            Chưa có tài khoản?{' '}
                            <a
                                href="#"
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                Đăng ký ngay
                            </a>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}