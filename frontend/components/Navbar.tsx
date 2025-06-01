import { Bell, Menu, Search, User } from "lucide-react";

export default function Navbar() {
    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Menu className="h-6 w-6 text-gray-600" />
                    <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <Search className="h-5 w-5 text-gray-600" />
                    <Bell className="h-5 w-5 text-gray-600" />
                    <User className="h-8 w-8 text-gray-600 bg-gray-200 rounded-full p-1" />
                </div>
            </div>
        </div>
    );
}