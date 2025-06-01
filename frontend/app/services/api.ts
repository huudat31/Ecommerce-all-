import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:5091/api",

});
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export const createCategory = async (data: { name: string, description: string }) => {
  try {
    const response = await api.post('/categories', data);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export const updateCategory = async (id: string, data: { name: string, description: string }) => {
  try {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}


export const deleteCategory = async (id: string) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }

}

export const fetchUser = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}
export const createUser = async (data: { name: string, email: string, password: string, role: string, phone: string, isActive: boolean }) => {
  try {
    const response = await api.post('/users', data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export const updateUser = async (id: string, data: { name: string, email: string, password: string, role: string, phone: string, isActive: boolean }) => {
  try {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}
export const deleteUser = async (id: string) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }

}

export const fetchProducts = async () => {
  try {
    const response = await api.get('/Products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}
export const createProduct = async (data: { name: string, description: string, price: number, categoryId: string, stock: number, imageUrl: string }) => {
  try {
    const response = await api.post('/Products', data);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}
export const updateProduct = async (id: string, data: { name: string, description: string, price: number, categoryId: string, stock: number, imageUrl: string }) => {
  try {
    const response = await api.put(`/Products/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}
export const deleteProduct = async (id: string) => {
  try {
    const response = await api.delete(`/Products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}