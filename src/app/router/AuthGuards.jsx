import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";
import { getMe } from "../../features/auth/apis/auth.thunk.js";
import Auth from "../../features/auth/ui/Auth.jsx";

const STUDENT_CHAT_PATH =
  "/admin/dashboard/6af48e9abfacf564ccf0a117/sessionsStudent/6af86f85441edd8d80d57889";

export function AuthBootstrap() {
  const dispatch = useDispatch();
  const location = useLocation();
  const initialized = useSelector((state) => state.auth.initialized);
  const started = useRef(false);

  useEffect(() => {
    if (
      location.pathname === "/auth/callback" ||
      initialized ||
      started.current
    ) {
      return;
    }

    started.current = true;
    dispatch(getMe());
  }, [dispatch, initialized, location.pathname]);

  return <Outlet />;
}

function RouteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
      Checking your account...
    </div>
  );
}

export function RequireAdmin({ children }) {
  const { user, initialized } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!initialized) return <RouteLoading />;
  if (user?.role !== "admin") {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children || <Outlet />;
}

export function RedirectAuthenticatedUser() {
  const { user, initialized } = useSelector((state) => state.auth);

  if (!initialized) return <RouteLoading />;
  if (!user) return <Auth />;

  return (
    <Navigate
      to={user.role === "admin" ? "/admin/courses" : STUDENT_CHAT_PATH}
      replace
    />
  );
}
