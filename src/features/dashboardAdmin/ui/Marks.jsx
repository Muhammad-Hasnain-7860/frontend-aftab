import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { axiosInstance } from "../../../app/api/axiosInstance";

function Marks() {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchMarks = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get(
          `/common/course-marks/${courseId}`,
        );

        if (!cancelled) {
          setStudents(response.data.data || []);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError.response?.data?.msg ||
              requestError.message ||
              "Failed to fetch course marks",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMarks();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-sm text-slate-500">Admin / Marks</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          Course Marks
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Marks for all students and sessions in this course.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4 sm:p-5">
          <h2 className="font-semibold text-slate-900">Student Marks</h2>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {students.length} students
          </span>
        </div>

        {loading ? (
          <p className="p-10 text-center text-sm text-slate-500">
            Loading marks...
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
              <li key={student._id} className="space-y-3 p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {student.displayName || "Student"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {student.email}
                    </p>
                  </div>
                  <p className="shrink-0 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                    Total: {student.totalMarks}
                  </p>
                </div>

                {student.marks.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {student.marks.map((mark) => (
                      <span
                        key={mark.lectureSessionId}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"
                      >
                        {mark.lectureTitle}:{" "}
                        <strong className="text-slate-800">
                          {mark.totalMarks}
                        </strong>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    No session marks available.
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Marks;
