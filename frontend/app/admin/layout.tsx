import React  from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";


export default function AdminLayout({ children} : {children: React.ReactNode}){
    return (
        <div>
            <div className="flex h-screen">
                {/*chèn Sidebar */}
                <Sidebar />
                <div className="flex-1">
                    <Navbar/>
                    {/* chèn nội dung các trang trong  admin  */}
                    <main className="p-4">{children}</main>
                </div>
            </div>
        </div>
    )
}