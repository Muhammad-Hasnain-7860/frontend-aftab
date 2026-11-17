
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
    {
      label: "Students",
      path: `/admin/dashboard/${courseId}/students`,
    },
    {
      label: "Marks",
      path: `/admin/dashboard/${courseId}/marks`,
    },
    {
      label: "Deadlines",
      path: `/admin/dashboard/${courseId}/deadlines`,
    },
    {
      label: "Student Access",
      path: `/admin/dashboard/${courseId}/student-access`,
    },
  ];

  return (
    <aside className="w-full border-b border-slate-200 bg-white md:w-56 md:shrink-0 md:border-b-0 md:border-r md:flex md:flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 p-3 sm:p-4 md:justify-start md:border-b">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-emerald-700 text-sm font-semibold text-white">
            S
          </div>

          <div>
            <p className="text-sm font-semibold">Aftab Academy</p>
            <p className="text-[11px] text-slate-500 md:text-xs">Admin Portal</p>
          </div>
        </div>
      </div>

      <nav className="overflow-x-auto p-2 md:flex-1 md:p-3">
        <ul className="flex min-w-max gap-2 md:flex-col md:gap-1">
          {NAV.map((item) => (
            <li key={item.label} className="shrink-0 md:shrink">
              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-sm transition whitespace-nowrap ${
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
