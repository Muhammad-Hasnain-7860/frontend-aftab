import { Link, Outlet } from "react-router";
import { useSelector } from "react-redux";

function StudentLayout() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            to="/student/dashboard"
            className="text-lg font-bold tracking-tight text-emerald-800"
          >
            Aftab Academy
          </Link>
          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-medium">
              {user?.displayName || "Student"}
            </p>
            <p className="text-xs text-slate-500">Student Dashboard</p>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;
