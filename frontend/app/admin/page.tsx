import React from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Category from "./categories/page";   

export default function AdminLayout({children}: {children: React.ReactNode}) {
    return (
        <div>
            <Navbar />
            <div className="flex">
                <Sidebar />
                <div className="flex-1 p-4">
                    
                    <div className="mb-4">
                        {children}
                    </div>
                    <Category />
                </div>
            </div>
        </div>
    );
}