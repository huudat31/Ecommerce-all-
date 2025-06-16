"use client";
import { createProduct, deleteProduct, fetchProducts, updateProduct, fetchCategories } from "@/app/services/api";
import { Package, Edit, Trash2, Plus, X, Image } from "lucide-react";
import { useEffect, useState } from "react";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    inStock: boolean; // Thêm field inStock
    category: string;
    categoryId: string; // Thêm categoryId
    imageUrl: string;
}

interface Category {
    id: string;
    name: string;
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<number | string>(''); // Allow string for empty input
    const [stock, setStock] = useState<number | string>(''); // Allow string for empty input
    const [categoryId, setCategoryId] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>(''); // Thêm imageUrl state
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editProductId, setEditProductId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [image, setImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [productsData, categoriesData] = await Promise.all([
                fetchProducts(),
                fetchCategories() // Giả sử có API fetchCategories
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error instanceof Error ? error.message : "Lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const loadProducts = async () => {
        try {
            setError(null);
            const data = await fetchProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError(error instanceof Error ? error.message : "Lỗi khi tải sản phẩm");
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setStock('');
        setCategoryId('');
        setImageUrl(''); // Reset imageUrl
        setIsEditing(false);
        setEditProductId(null);
        setImage(null);
        setShowForm(false);
        setError(null);
    };

    const validateForm = () => {
        if (!name.trim()) {
            setError("Tên sản phẩm không được để trống");
            return false;
        }
        if (!categoryId.trim()) {
            setError("Danh mục không được để trống");
            return false;
        }
        if (!price || Number(price) <= 0) {
            setError("Giá phải lớn hơn 0");
            return false;
        }
        if (stock === '' || Number(stock) < 0) {
            setError("Số lượng tồn kho phải lớn hơn hoặc bằng 0");
            return false;
        }
        if (!description.trim()) {
            setError("Mô tả không được để trống");
            return false;
        }
        return true;
    };

    const handleCreateProduct = async () => {
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            setError(null);

            const productData = {
                name: name.trim(),
                description: description.trim(),
                price: Number(price),
                categoryId: categoryId.trim(),
                stock: Number(stock),
                imageUrl: imageUrl.trim() || '' // Sử dụng imageUrl từ state
            };

            await createProduct(productData);
            resetForm();
            await loadProducts(); // Reload products after creation
        } catch (error) {
            console.error("Error creating product:", error);
            setError(error instanceof Error ? error.message : "Lỗi khi tạo sản phẩm");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateProduct = async () => {
        if (!editProductId || !validateForm()) return;

        try {
            setIsSubmitting(true);
            setError(null);

            const productData = {
                name: name.trim(),
                description: description.trim(),
                price: Number(price),
                categoryId: categoryId.trim(),
                stock: Number(stock),
                imageUrl: imageUrl.trim() || '' // Sử dụng imageUrl từ state
            };

            await updateProduct(editProductId.toString(), productData);
            resetForm();
            await loadProducts(); // Reload products after update
        } catch (error) {
            console.error("Error updating product:", error);
            setError(error instanceof Error ? error.message : "Lỗi khi cập nhật sản phẩm");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

        try {
            setError(null);
            await deleteProduct(id.toString());
            await loadProducts(); // Reload products after deletion
        } catch (error) {
            console.error("Error deleting product:", error);
            setError(error instanceof Error ? error.message : "Lỗi khi xóa sản phẩm");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            await handleUpdateProduct();
        } else {
            await handleCreateProduct();
        }
    };

    const handleEdit = (product: Product) => {
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setStock(product.stock);
        setCategoryId(product.categoryId || product.category); // Ưu tiên categoryId
        setImageUrl(product.imageUrl || ''); // Set imageUrl
        setIsEditing(true);
        setEditProductId(product.id);
        setShowForm(true);
        setError(null);
    };

    // Hàm helper để lấy tên category từ categoryId
    const getCategoryName = (categoryId: string) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : categoryId; // Fallback to categoryId if not found
    };

    // Hàm helper để kiểm tra trạng thái sản phẩm
    const getProductStatus = (product: Product) => {
        // Ưu tiên field inStock nếu có, không thì dựa vào stock
        const isAvailable = product.inStock !== undefined ? product.inStock : product.stock > 0;

        if (!isAvailable || product.stock === 0) {
            return { status: 'outOfStock', label: 'Hết hàng', color: 'red' };
        } else if (product.stock <= 10) {
            return { status: 'lowStock', label: 'Sắp hết', color: 'yellow' };
        } else {
            return { status: 'inStock', label: 'Còn hàng', color: 'green' };
        }
    };

    const handleAddNew = () => {
        resetForm();
        setShowForm(true);
    };

    // Calculate statistics - Sửa lại logic tính toán
    const totalProducts = products.length;
    type ProductStatusKey = 'inStock' | 'outOfStock' | 'lowStock';
    const productStats = products.reduce((acc, product) => {
        const status = getProductStatus(product);
        acc[status.status as ProductStatusKey]++;
        return acc;
    }, { inStock: 0, outOfStock: 0, lowStock: 0 });

    const { inStock, outOfStock, lowStock } = productStats;

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
                <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Thêm sản phẩm mới
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Tổng sản phẩm</p>
                            <p className="text-2xl font-bold text-blue-800">{totalProducts}</p>
                        </div>
                        <Package className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Còn hàng</p>
                            <p className="text-2xl font-bold text-green-800">{inStock}</p>
                        </div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-600 text-sm font-medium">Hết hàng</p>
                            <p className="text-2xl font-bold text-red-800">{outOfStock}</p>
                        </div>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-600 text-sm font-medium">Sắp hết</p>
                            <p className="text-2xl font-bold text-yellow-800">{lowStock}</p>
                        </div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                            {isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
                        </h3>
                        <button
                            onClick={resetForm}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            type="button"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên sản phẩm *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập tên sản phẩm"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Danh mục *
                            </label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isSubmitting}
                            >
                                <option value="">Chọn danh mục</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giá (VNĐ) *
                            </label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0"
                                min="1"
                                step="1000"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số lượng tồn kho *
                            </label>
                            <input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0"
                                min="0"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                URL Hình ảnh
                            </label>
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://example.com/image.jpg"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mô tả *
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập mô tả sản phẩm"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="md:col-span-2 flex gap-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                {isSubmitting
                                    ? (isEditing ? 'Đang cập nhật...' : 'Đang thêm...')
                                    : (isEditing ? 'Cập nhật' : 'Thêm mới')
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

            {/* Products Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hình ảnh
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên sản phẩm
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Danh mục
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Giá
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tồn kho
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map((product) => {
                            const status = getProductStatus(product);
                            return (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-16 h-16 flex-shrink-0">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        const next = e.currentTarget.nextElementSibling as HTMLElement | null;
                                                        if (next) next.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className={`w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center ${product.imageUrl ? 'hidden' : 'flex'}`}
                                            >
                                                <Image className="h-6 w-6 text-gray-400" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {product.name}
                                            </div>
                                            <div className="text-sm text-gray-500 max-w-xs truncate">
                                                {product.description}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {getCategoryName(product.categoryId || product.category)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.price.toLocaleString('vi-VN')} VNĐ
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.stock}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${status.color}-100 text-${status.color}-800`}>
                                            {status.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                                title="Sửa sản phẩm"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="text-red-600 hover:text-red-900 transition-colors"
                                                title="Xóa sản phẩm"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Empty state */}
            {products.length === 0 && !loading && (
                <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có sản phẩm nào</h3>
                    <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách thêm sản phẩm mới.</p>
                    <div className="mt-6">
                        <button
                            onClick={handleAddNew}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Thêm sản phẩm đầu tiên
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}