import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getAllCourses } from "../apis/course.thunk";

export default function Courses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { courses, loading, error } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(getAllCourses());
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Admin Panel
            <span className="text-slate-300">/</span>
            <span className="text-slate-500">Courses</span>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Courses
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Select a course to access its dashboard and manage learning
                activities.
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/courses/create")}
              className="rounded-xl bg-emerald-600 cursor-pointer px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              + Create Course
            </button>

            {!loading && !error && courses.length > 0 && (
              <div className="flex w-fit items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Available Courses</p>
                  <p className="text-lg font-bold leading-5 text-slate-900">
                    {courses.length}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-100" />
                <div className="mt-6 h-5 w-2/3 rounded bg-slate-100" />
                <div className="mt-3 h-4 w-full rounded bg-slate-100" />
                <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />
                <div className="mt-7 h-px bg-slate-100" />
                <div className="mt-5 h-4 w-1/2 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M10.3 3.9L1.8 18.5A2 2 0 003.5 21h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">
                  Unable to load courses
                </h2>
                <p className="mt-1 text-sm leading-6 text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && courses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <svg
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
                />
              </svg>
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No courses available
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              There are currently no courses to display.
            </p>
          </div>
        )}

        {/* Course Cards */}
        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <button
                key={course._id}
                type="button"
                onClick={() => navigate(`/admin/dashboard/${course._id}`)}
                className="group flex min-h-[230px] flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:p-6"
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100">
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-emerald-50 group-hover:text-emerald-700">
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14m-7-7l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>

                <div className="mt-6 w-full">
                  <h2 className="break-words text-lg font-semibold text-slate-900 transition group-hover:text-emerald-700">
                    {course.name}
                  </h2>

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                    {course.description ||
                      "Manage this course and its learning activities."}
                  </p>
                </div>

                <div className="mt-auto flex w-full items-center justify-between border-t border-slate-100 pt-5">
                  <span className="text-sm font-semibold text-emerald-700">
                    View Dashboard
                  </span>
                  <span className="text-xs text-slate-400 transition group-hover:text-emerald-600">
                    Open course
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
