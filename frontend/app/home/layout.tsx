"use client";
import React from 'react';
import Sidebar from './sizebar';


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi">
            <body>
                <div className="flex min-h-screen bg-gray-50">
                    <Sidebar />
                    <main className="flex-1 ml-64">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}