import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { axiosInstance } from "../../../app/api/axiosInstance";

function Students() {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get(
          `/common/courseBy/${courseId}`,
        );

        if (!cancelled) {
          setStudents(response.data.data || []);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError.response?.data?.msg ||
              requestError.message ||
              "Failed to fetch students",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStudents();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-sm text-slate-500">Admin / Students</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          Course Students
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Students enrolled in this course.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4 sm:p-5">
          <h2 className="font-semibold text-slate-900">Students</h2>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            {students.length} total
          </span>
        </div>

        {loading ? (
          <p className="p-10 text-center text-sm text-slate-500">
            Loading students...
          </p>
        ) : error ? (
          <p className="p-6 text-center text-sm text-red-600">{error}</p>
        ) : students.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">
            No students found for this course.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {students.map((student) => (
              <li
                key={student._id}
                className="flex min-w-0 items-center gap-3 p-4 sm:gap-4 sm:px-5"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 font-semibold text-emerald-700">
                  {student.displayName?.charAt(0)?.toUpperCase() || "S"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {student.displayName || "Student"}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {student.email}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Students;
