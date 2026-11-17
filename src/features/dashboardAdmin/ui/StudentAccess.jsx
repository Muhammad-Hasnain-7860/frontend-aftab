import { useEffect, useState } from "react";
import { axiosInstance } from "../../../app/api/axiosInstance";

const getAssignedCourses = (student) => {
  const courses = new Map();

  [...(student.courses || []), student.course]
    .filter(Boolean)
    .forEach((course) => {
      const courseId = typeof course === "string" ? course : course._id;
      if (courseId) {
        courses.set(courseId, typeof course === "string" ? { _id: courseId } : course);
      }
    });

  return [...courses.values()];
};

function StudentAccess() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingStudentId, setSavingStudentId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [studentsResponse, coursesResponse] = await Promise.all([
          axiosInstance.get("/common/students"),
          axiosInstance.get("/course"),
        ]);

        if (!cancelled) {
          setStudents(studentsResponse.data.data || []);
          setCourses(coursesResponse.data.data || []);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError.response?.data?.msg ||
              requestError.message ||
              "Failed to load students and courses",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const grantAccess = async (student) => {
    const courseId = selectedCourses[student._id];
    if (!courseId) return;

    setSavingStudentId(student._id);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.patch(
        `/common/students/${student._id}/courses`,
        { courseId },
      );
      const updatedStudent = response.data.data;

      setStudents((currentStudents) =>
        currentStudents.map((currentStudent) =>
          currentStudent._id === updatedStudent._id
            ? updatedStudent
            : currentStudent,
        ),
      );
      setSelectedCourses((currentSelections) => ({
        ...currentSelections,
        [student._id]: "",
      }));
      setSuccess(`Course access granted to ${updatedStudent.displayName}.`);
    } catch (requestError) {
      setError(
        requestError.response?.data?.msg ||
          requestError.message ||
          "Failed to grant course access",
      );
    } finally {
      setSavingStudentId("");
    }
  };

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-sm text-slate-500">Admin / Student Access</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          Manage Course Access
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Grant a student access to another course after confirming payment.
        </p>
      </header>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {success}
        </p>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <h2 className="font-semibold text-slate-900">All Students</h2>
          <p className="mt-1 text-xs text-slate-500">
            {students.length} registered students
          </p>
        </div>

        {loading ? (
          <p className="p-10 text-center text-sm text-slate-500">
            Loading students and courses...
          </p>
        ) : error && students.length === 0 ? null : students.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">
            No registered students found.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {students.map((student) => {
              const assignedCourses = getAssignedCourses(student);
              const assignedCourseIds = new Set(
                assignedCourses.map((course) => String(course._id)),
              );
              const availableCourses = courses.filter(
                (course) => !assignedCourseIds.has(String(course._id)),
              );

              return (
                <li key={student._id} className="space-y-4 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 font-semibold text-emerald-700">
                      {student.displayName?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {student.displayName}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {student.email}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-medium text-slate-600">
                      Current course access
                    </p>
                    {assignedCourses.length ? (
                      <div className="flex flex-wrap gap-2">
                        {assignedCourses.map((course) => (
                          <span
                            key={course._id}
                            className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700"
                          >
                            {course.title || "Course"}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">
                        No course access assigned.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <select
                      value={selectedCourses[student._id] || ""}
                      onChange={(event) =>
                        setSelectedCourses((currentSelections) => ({
                          ...currentSelections,
                          [student._id]: event.target.value,
                        }))
                      }
                      disabled={availableCourses.length === 0}
                      className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-600 disabled:bg-slate-50"
                    >
                      <option value="">
                        {availableCourses.length
                          ? "Select a course"
                          : "All courses already assigned"}
                      </option>
                      {availableCourses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => grantAccess(student)}
                      disabled={
                        !selectedCourses[student._id] ||
                        savingStudentId === student._id
                      }
                      className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {savingStudentId === student._id
                        ? "Granting..."
                        : "Grant access"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

export default StudentAccess;
