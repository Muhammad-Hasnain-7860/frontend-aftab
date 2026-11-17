import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { axiosInstance } from "../../../app/api/axiosInstance";

function StudentCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [courseMarks, setCourseMarks] = useState({ marks: [], totalMarks: 0 });
  const [audioUrls, setAudioUrls] = useState({});
  const [loadingAudioId, setLoadingAudioId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchCourseContent = async () => {
      try {
        setLoading(true);
        setError("");

        const [coursesResponse, lecturesResponse, sessionsResponse, marksResponse] =
          await Promise.all([
            axiosInstance.get("/common/my-courses"),
            axiosInstance.get(`/lecture/${courseId}`),
            axiosInstance.get(`/lectureSession/${courseId}`),
            axiosInstance.get(`/common/my-courses/${courseId}/marks`),
          ]);

        if (cancelled) return;

        const myCourse = (coursesResponse.data.data || []).find(
          (item) => String(item._id) === String(courseId),
        );

        if (!myCourse) {
          setError("This course is not assigned to your account.");
          return;
        }

        setCourse(myCourse);
        setLectures(lecturesResponse.data.data || []);
        setSessions(sessionsResponse.data.data || []);
        setCourseMarks(
          marksResponse.data.data || { marks: [], totalMarks: 0 },
        );
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError.response?.data?.msg ||
              requestError.message ||
              "Course content could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCourseContent();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const handlePlayAudio = async (lecture) => {
    try {
      setError("");
      setLoadingAudioId(lecture._id);

      const response = await axiosInstance.get("/audio/audio-url", {
        params: { key: lecture.audioKey },
      });

      setAudioUrls((previous) => ({
        ...previous,
        [lecture._id]: response.data.url,
      }));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Lecture audio could not be loaded.",
      );
    } finally {
      setLoadingAudioId("");
    }
  };

  const findLecture = (lectureId) =>
    lectures.find((lecture) => String(lecture._id) === String(lectureId));

  if (loading) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Loading course...
      </p>
    );
  }

  if (error && !course) {
    return (
      <div className="space-y-4">
        <Link
          to="/student/dashboard"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
        >
          ← My courses
        </Link>
        <p className="rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/student/dashboard"
        className="inline-flex text-sm font-medium text-emerald-700 hover:text-emerald-900"
      >
        ← My courses
      </Link>

      {course && (
        <header className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <p className="text-sm font-medium text-emerald-700">Course</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {course.title}
          </h1>
          {course.description && (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              {course.description}
            </p>
          )}
        </header>
      )}

      {error && (
        <p className="rounded-xl border border-red-200 bg-white p-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Lectures</h2>
            <p className="mt-1 text-sm text-slate-500">
              Listen to your course lessons.
            </p>
          </div>
          <span className="text-sm text-slate-500">{lectures.length} lectures</span>
        </div>

        {lectures.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
            No lectures are available yet.
          </p>
        ) : (
          <div className="space-y-3">
            {lectures.map((lecture) => (
              <article
                key={lecture._id}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold">{lecture.title}</h3>
                  {lecture.description && (
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {lecture.description}
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  {audioUrls[lecture._id] ? (
                    <audio
                      controls
                      src={audioUrls[lecture._id]}
                      className="w-full sm:w-64"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(lecture)}
                      disabled={loadingAudioId === lecture._id}
                      className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loadingAudioId === lecture._id ? "Loading..." : "Play lecture"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Sessions</h2>
            <p className="mt-1 text-sm text-slate-500">
              Open a session to chat with your instructor.
            </p>
          </div>
          <span className="text-sm text-slate-500">{sessions.length} sessions</span>
        </div>

        {sessions.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
            No sessions are available yet.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {sessions.map((session) => {
              const lecture = findLecture(session.lectureId);
              const canChat = session.status === "active";

              return (
                <article
                  key={session._id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:p-5"
                >
                  <div>
                    <h3 className="font-semibold">
                      {lecture?.title || "Lecture session"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Deadline: {session.deadline || "Not set"}
                    </p>
                    <p className="mt-1 text-xs capitalize text-slate-500">
                      {session.status || "active"}
                    </p>
                  </div>
                  {canChat ? (
                    <Link
                      to={`/student/courses/${courseId}/sessions/${session._id}`}
                      className="shrink-0 rounded-lg bg-emerald-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-800"
                    >
                      Open chat
                    </Link>
                  ) : (
                    <span className="shrink-0 rounded-lg bg-slate-100 px-4 py-2.5 text-center text-sm text-slate-500">
                      Chat unavailable
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">My Marks</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your marks for this course's sessions.
            </p>
          </div>
          <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800">
            Total: {courseMarks.totalMarks || 0}
          </span>
        </div>

        {(courseMarks.marks || []).length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
            No session marks are available yet.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {courseMarks.marks.map((mark) => (
              <li
                key={mark.lectureSessionId}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
              >
                <span className="min-w-0 truncate text-sm font-medium text-slate-700">
                  {mark.lectureTitle}
                </span>
                <span className="shrink-0 text-sm font-semibold text-emerald-800">
                  {mark.totalMarks}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default StudentCourse;
