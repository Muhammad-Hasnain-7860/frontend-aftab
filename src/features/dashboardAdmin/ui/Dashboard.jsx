import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../apis/dashboardthunk";
import { NavLink, useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { useState } from "react";
import { axiosInstance } from "../../../app/api/axiosInstance";
import Sidebar from "./Sidebar";
const NAV = [
  "Dashboard",
  "lectures",
  "Lecture Sessions",
  "Sabq Submissions",
  "Messages",
  "Students",
  "Marks",
];

const SUBMISSIONS = [
  {
    initials: "AM",
    name: "Ahmed Memon",
    session: "Session #12",
    time: "12m ago",
    dur: "2m 15s",
  },
  {
    initials: "HM",
    name: "Hassan Ali",
    session: "Session #12",
    time: "34m ago",
    dur: "3m 02s",
  },
  {
    initials: "UM",
    name: "Usman Khan",
    session: "Session #12",
    time: "1h ago",
    dur: "1m 45s",
  },
];

const ATTENTION = [
  {
    initials: "AM",
    name: "Ahmed Memon",
    listening: "Completed",
    submission: "Pending",
  },
  {
    initials: "SK",
    name: "Saad Khan",
    listening: "Not completed",
    submission: "Not submitted",
  },
  {
    initials: "HM",
    name: "Hassan Ali",
    listening: "Completed",
    submission: "Submitted",
  },
  {
    initials: "UM",
    name: "Usman Khan",
    listening: "Not completed",
    submission: "Not submitted",
  },
];

const card = "rounded-lg border border-slate-200 bg-white p-5";

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  useEffect(() => {
    if (courseId) {
      dispatch(getDashboardStats(courseId));
    }
  }, [courseId]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="min-w-0 flex-1">
        <Topbar />

        <main className="mx-auto max-w-6xl space-y-5 p-4 md:p-6">
          <Hero courseId={courseId} />
          <StatsRow />

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              <SessionCard />
              <SubmissionQueue />
            </div>

            <aside className="space-y-5">
              {/* <QuickActions /> */}
              <NeedingAttention />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

function Topbar() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 md:px-6">
      <p className="text-sm text-slate-600">Aftab Academy / Admin</p>

      <div className="text-right">
        <p className="text-sm font-medium">Qari / Admin</p>
        <p className="text-xs text-slate-500">Administrator</p>
      </div>
    </header>
  );
}

function Hero({ courseId }) {
  const navigate = useNavigate();

  return (
    <section
      className={`${card} flex flex-wrap items-center justify-between gap-4`}
    >
      <div>
        <p className="text-xs text-slate-500">Admin Dashboard</p>

        <h1 className="mt-1 text-xl font-semibold">Assalamu Alaikum</h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage lectures, sessions and student Sabq submissions.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/admin/lectureupload/${courseId}`)}
          className={btnPrimary}
        >
          + Upload Lecture
        </button>
      </div>
    </section>
  );
}

function StatsRow() {
  const { stats, loading, error } = useSelector((state) => state.dashboard);

  if (loading) {
    return (
      <div className="py-10 text-center text-slate-500">
        Loading dashboard stats...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center text-red-600">
        {error}
      </div>
    );
  }

  const STATS = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      note: "Registered students",
    },
    {
      label: "Total Lectures",
      value: stats.totalLectures,
      note: "Uploaded audio lectures",
    },
    {
      label: "Active Sessions",
      value: stats.todaySession,
      note: "Currently active today",
    },
    {
      label: "Pending Submissions",
      value: stats.pendingSubmissions,
      note: "Awaiting submission",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map((s) => (
        <article key={s.label} className={card}>
          <p className="text-sm text-slate-500">{s.label}</p>

          <p className="mt-2 text-3xl font-semibold">{s.value}</p>

          <p className="mt-1 text-xs text-slate-500">{s.note}</p>
        </article>
      ))}
    </section>
  );
}

function SessionCard() {
  const [todaySession, setTodaySession] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { courseId } = useParams();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get(
          `/common/dashboard-todayLecture/${courseId}`
        );

        setTodaySession(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.msg ||
          err.message ||
          "Failed to fetch today's sessions"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  if (loading) {
    return (
      <div className="py-10 text-center text-sm text-slate-500">
        Loading today's sessions...
      </div>
    );
  }

  if (error) {
    return (
      <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
        {error}
      </p>
    );
  }

  if (!todaySession.length) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        No sessions available today.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {todaySession.map((session) => (
        <section key={session.sessionId} className={card}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                Session #{session.sessionNumber} · {session.status}
              </span>

              <h2 className="mt-2 text-lg font-semibold">
                {session.lectureTitle}
              </h2>

              <p className="text-sm text-slate-500">
                Session date:{" "}
                {new Date(session.sessionDate).toLocaleDateString()}
              </p>

              <p className="text-sm text-slate-500">
                Submission deadline: {session.submissionDeadline}
              </p>
            </div>
          </div>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <Progress
              label="Audio submissions"
              value={`${session.recitationsSubmitted.submitted} / ${session.recitationsSubmitted.total} students`}
              pct={
                session.recitationsSubmitted.total
                  ? (session.recitationsSubmitted.submitted /
                      session.recitationsSubmitted.total) * 100
                  : 0
              }
            />

            <Progress
              label="Pending submissions"
              value={`${session.pendingSubmissions} students`}
              pct={
                session.recitationsSubmitted.total
                  ? (session.pendingSubmissions /
                      session.recitationsSubmitted.total) * 100
                  : 0
              }
              danger
            />
          </dl>
        </section>
      ))}
    </div>
  );
}

function Progress({ label, value, pct, danger }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>

      <dd
        className={`mt-1 text-sm font-semibold ${danger ? "text-red-600" : ""}`}
      >
        {value}
      </dd>

      <div className="mt-2 h-1 rounded-full bg-slate-100">
        <div
          className={`h-1 rounded-full ${danger ? "bg-red-500" : "bg-emerald-600"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function SubmissionQueue() {
  const { courseId } = useParams();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get(
          `/common/dashboard-todaySubmission/${courseId}`,
        );

        setStudents(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch submissions");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className={card}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Today's Sabq Submissions</h2>

        <span className="text-xs font-medium text-emerald-700">
          {students.length} Submitted
        </span>
      </div>

      {loading ? (
        <p className="py-6 text-center text-sm text-slate-500">
          Loading submissions...
        </p>
      ) : error ? (
        <p className="py-6 text-center text-sm text-red-500">{error}</p>
      ) : students.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">
          No audio submissions yet.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {students.map((student) => (
            <li
              key={student._id}
              className="flex flex-wrap items-center gap-3 py-3"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-medium text-slate-600">
                {student.displayName?.charAt(0)?.toUpperCase() || "S"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {student.displayName}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {student.email}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                Submitted
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}



function NeedingAttention() {
  const { courseId } = useParams();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get(
          `/common/dashboard-todayPendingStudents/${courseId}`,
        );

        setStudents(response.data.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch students");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className={card}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">Student Activity</h2>

        <span className="text-xs text-red-600">{students.length} Pending</span>
      </div>

      {loading ? (
        <p className="py-6 text-center text-sm text-slate-500">
          Loading students...
        </p>
      ) : error ? (
        <p className="py-6 text-center text-sm text-red-500">{error}</p>
      ) : students.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">
          All students have submitted their audio.
        </p>
      ) : (
        <ul className="space-y-3">
          {students.map((student) => (
            <li
              key={student._id}
              className="flex items-center gap-3 rounded-lg border border-slate-100 p-3"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-medium text-slate-600">
                {student.displayName?.charAt(0)?.toUpperCase() || "S"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                  {student.displayName}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {student.email}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                Audio Pending
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
