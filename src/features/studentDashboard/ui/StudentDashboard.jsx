import { useEffect, useState } from "react";
import { Link } from "react-router";
import { axiosInstance } from "../../../app/api/axiosInstance";

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get("/common/my-courses");
        if (!cancelled) setCourses(response.data.data || []);
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError.response?.data?.msg ||
              requestError.message ||
              "Courses could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCourses();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-emerald-700">Your learning</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          My Courses
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Open a course to view its lectures, sessions, and marks.
        </p>
      </header>

      {loading ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading your courses...
        </p>
      ) : error ? (
        <p className="rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-600">
          {error}
        </p>
      ) : courses.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          No courses have been assigned to your account yet.
        </p>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course._id}
              to={`/student/courses/${course._id}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
            >
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt=""
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="h-44 bg-gradient-to-br from-emerald-100 to-teal-50" />
              )}
              <div className="p-5">
                <h2 className="text-lg font-semibold group-hover:text-emerald-800">
                  {course.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                  {course.description || "View course content and progress."}
                </p>
                <span className="mt-5 inline-flex items-center text-sm font-semibold text-emerald-700">
                  Open course <span className="ml-2" aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}

export default StudentDashboard;
