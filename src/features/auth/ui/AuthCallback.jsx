
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { authRefresh, getMe } from "../apis/auth.thunk";

const AuthCallback = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    const initializeAuth = async () => {
      const result = await dispatch(authRefresh());

      if (authRefresh.fulfilled.match(result)) {
        const meResult = await dispatch(getMe());
        

        if (getMe.fulfilled.match(meResult)) {
          if (meResult.payload.user.role === "admin") {
            timer = setTimeout(() => {
              navigate("/admin/courses", { replace: true });
            }, 1500);
          } else {
            timer = setTimeout(() => {
              navigate("/admin/dashboard/6af48e9abfacf564ccf0a117/sessionsStudent/6af86f85441edd8d80d57889", { replace: true });
            }, 1500);
          }
        }
      }
    };

    initializeAuth();

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm border border-slate-200">
        {loading ? (
          <>
            <div className="mx-auto h-12 w-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
            <h2 className="mt-6 text-xl font-semibold text-slate-800">
              Verifying your account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Please wait while we securely sign you in.
            </p>
          </>
        ) : error ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 text-2xl">
              !
            </div>
            <h2 className="mt-5 text-xl font-semibold text-slate-800">
              Authentication Failed
            </h2>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button
              onClick={() => navigate("/auth")}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Back to Login
            </button>
          </>
        ) : (
          <div className="py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <svg
                className="h-7 w-7 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-5 text-xl font-semibold text-slate-800">
              Authentication Successful
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Your account has been verified successfully.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
