
import { Outlet } from "react-router";
import Sidebar from "../../features/dashboardAdmin/ui/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
