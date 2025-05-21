
    "use client";

    import React, { useEffect, useState } from "react";

    import { fetchCategories, createCategory, updateCategory, deleteCategory } from "@/app/services/api";


    export default function Category(){
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
        


        // xử lí khi nhấn nút thêm nhóm sản phẩm mới
        const handleCreateCategory = async () => {
            
            try{
                if(!name.trim() ){
                alert("Nhap ten nhom san pham");
                return ;
                }
            if(!description.trim()){
                alert("Nhap mo ta nhom san pham");
            return ;
                }
            await createCategory({name, description});
                setCategories([...categories, {name, description}]);
                setName('');
                setDescription('');
            }
            catch (error) {
                console.error("Error creating category:", error);
                setError("Error creating category");
            }
        }
        // xử lí khi nhấn nút sửa nhóm sản phẩm
        const handleUpdateCategory = async (id: string) => {
            try {
                if(!name.trim() ){
                    alert("Nhap ten nhom san pham");
                    return ;
                }
                if(!description.trim()){
                    alert("Nhap mo ta nhom san pham");
                    return ;
                }
                await updateCategory(id, ({name, description}))
                setCategories(categories.map((categories) =>{
                    categories.id === id ? {...categories,name,description} :categories
                }))
                setName('');
                setDescription('');
                setIsEditing(false);
                setEditCategoryId(null);
            } catch (error) {
                console.error("Error updating category:", error);
                setError("Error updating category");
            }
        }
        // xử lí khi nhấn nút xóa nhóm sản phẩm
        const handleDeleteCategory = async (id: string) => {
            try{
                await deleteCategory(id);
                setCategories(categories.filter((category) => category.id !== id));
            }catch(error){
                console.error("Error updating category:", error);
                setError("Error updating category");
            }
        }
        return (
                <div>
                    <h1 className="text-2xl font-bold mb-4">Quản lí nhóm sản phẩm</h1>
                    <div className="mb-4">
                        <input type="text" className="border p-2 mr-2" onChange={(e) => setName(e.target.value)} placeholder="Tên nhóm sản phẩm" />
                        <input type="text" className="border p-2 mr-2" onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả nhóm sản phẩm" />



                        {isEditing ? (
                            <button className="bg-blue-500 text-white p-2" onClick={() => handleUpdateCategory}>Cập nhật</button> ):
                            (
                                <button className="bg-green-500 text-white p-2" onClick={handleCreateCategory}>Thêm nhóm sản phẩm</button>
                            )
                        }
                    </div>
                    <div className="mt-4">
                        <h2 className="font-semibold"> Danh sách nhóm sản phẩm</h2>
                        <ul>
                            {
                                categories.map((category) => (
                                    <li key={category.id} className="flex justify-between items-center border-b py-2">
                                        <span>{category.name}</span>
                                        <p className="text-sm text-gray-600">
                                            {category.description}
                                        </p>
                                        
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            
            )
        } 

