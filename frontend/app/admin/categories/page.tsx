"use client";

import React, { useEffect, useState } from "react";

import { fetchCategories, createCategory, updateCategory, deleteCategory } from "@/app/services/api";
import { AlertCircle, Check, Edit, Package, Plus, Trash2, X } from "lucide-react";


export default function Category() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    }).catch((error) => {
      setError(error.message);
      setLoading(false);
    })
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setIsEditing(false);
    setEditCategoryId(null);
  };

  // xử lí khi nhấn nút thêm nhóm sản phẩm mới
  const handleCreateCategory = async () => {

    try {
      if (!name.trim()) {
        alert("Nhap ten nhom san pham");
        return;
      }
      if (!description.trim()) {
        alert("Nhap mo ta nhom san pham");
        return;
      }
      const newCategory = await createCategory({ name, description });
      resetForm();
      // Refresh categories list after creating
      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);
    }
    catch (error) {
      console.error("Error creating category:", error);
      setError("Error creating category");
    }
  }

  // xử lí khi nhấn nút sửa nhóm sản phẩm
  const handleUpdateCategory = async () => {
    if (!editCategoryId) return;

    try {
      if (!name.trim()) {
        alert("Nhap ten nhom san pham");
        return;
      }
      if (!description.trim()) {
        alert("Nhap mo ta nhom san pham");
        return;
      }
      await updateCategory(editCategoryId.toString(), { name, description });
      setCategories(categories.map((category) =>
        category.id === editCategoryId ? { ...category, name, description } : category
      ));
      resetForm();
    } catch (error) {
      console.error("Error updating category:", error);
      setError("Error updating category");
    }
  }

  const handleEditClick = (category: any) => {
    setName(category.name);
    setDescription(category.description);
    setIsEditing(true);
    setEditCategoryId(category.id);
  };

  // xử lí khi nhấn nút xóa nhóm sản phẩm
  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Error deleting category");
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
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Package className="h-8 w-8 text-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Quản lý nhóm sản phẩm</h1>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Form Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {isEditing ? 'Cập nhật nhóm sản phẩm' : 'Thêm nhóm sản phẩm mới'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên nhóm sản phẩm
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên nhóm sản phẩm"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả nhóm sản phẩm
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả nhóm sản phẩm"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdateCategory}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <Check className="h-4 w-4 mr-2" />
                Cập nhật
              </button>
              <button
                onClick={resetForm}
                className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
              >
                <X className="h-4 w-4 mr-2" />
                Hủy
              </button>
            </>
          ) : (
            <button
              onClick={handleCreateCategory}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm nhóm sản phẩm
            </button>
          )}
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Danh sách nhóm sản phẩm ({categories.length})
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Chưa có nhóm sản phẩm nào</p>
            <p className="text-gray-400">Hãy thêm nhóm sản phẩm đầu tiên</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <div key={category.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditClick(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

