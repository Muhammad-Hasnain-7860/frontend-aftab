
import { Outlet } from "react-router";
import Sidebar from "../../features/dashboardAdmin/ui/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar />

        <main className="min-w-0 flex-1 p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
