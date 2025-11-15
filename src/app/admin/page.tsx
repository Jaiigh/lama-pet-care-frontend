"use client"
import AdminShell from "@/components/admin/AdminShell";
export default function AdminPage() {
return (
    <AdminShell title="Admin Dashboard" description="Manage administrative tasks and settings">
        {/* Admin dashboard content goes here */}
        <div> 
            <h1 className="text-2xl font-semibold text-slate-900 mb-6">Welcome to the Admin Dashboard</h1>
        </div>
    </AdminShell>
    );
}