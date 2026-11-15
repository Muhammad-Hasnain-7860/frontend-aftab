
import { NavLink, useParams } from "react-router";

const Sidebar = () => {
  const { courseId } = useParams();

  const NAV = [
    {
      label: "Dashboard",
      path: `/admin/dashboard/${courseId}`,
    },
    {
      label: "All Lectures",
      path: `/admin/dashboard/${courseId}/lectures`,
    },
    {
      label: "All Sessions",
      path: `/admin/dashboard/${courseId}/sessions`,
    },
  ];

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="flex items-center gap-2 border-b border-slate-200 p-4">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-emerald-700 text-sm font-semibold text-white">
          S
        </div>

        <div>
          <p className="text-sm font-semibold">Aftab Academy</p>
          <p className="text-xs text-slate-500">Admin Portal</p>
        </div>
      </div>

      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {NAV.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-emerald-700 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
