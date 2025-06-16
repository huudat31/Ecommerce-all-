"use client";

import React, { useState } from "react";
import Category from "./categories/page";
import Sidebar from "@/components/Sidebar";

import Products from "./products/page";

import Orders from "./orders/page";
import LoginPage from "./logins/page";
import User from "./users/page";

export default function AdminLayout() {
    const [activeComponent, setActiveComponent] = useState("categories");


    const renderContent = () => {
        switch (activeComponent) {
            case "categories":
                return <Category />;
            case "users":
                return <User />;
            case "products":
                return <Products />;
            case "orders":
                return <Orders />
            default:
                return <User />;
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <div className="flex">
                <Sidebar
                    activeComponent={activeComponent}
                    setActiveComponent={setActiveComponent}
                />
                <div className="flex-1 p-4">
                    <div className="mb-4">{renderContent()}</div>
                </div>
            </div>
        </div>
    );
}