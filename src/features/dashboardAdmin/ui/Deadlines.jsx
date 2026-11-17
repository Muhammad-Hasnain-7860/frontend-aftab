import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { axiosInstance } from "../../../app/api/axiosInstance";

const toDateInput = (deadline) => {
  if (!deadline) return "";

  const [day, month, year] = deadline.split("-");
  if (!day || !month || !year) return "";

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

function Deadlines() {
  const { courseId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [dates, setDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingSessionId, setSavingSessionId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get(
          `/lectureSession/${courseId}`,
        );
        const sessionList = response.data.data || [];

        if (!cancelled) {
          setSessions(sessionList);
          setDates(
            Object.fromEntries(
              sessionList.map((session) => [
                session._id,
                toDateInput(session.deadline),
              ]),
            ),
          );
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError.response?.data?.msg ||
              requestError.message ||
              "Failed to fetch lecture sessions",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSessions();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const updateDeadline = async (event, session) => {
    event.preventDefault();
    setSavingSessionId(session._id);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.patch(
        `/lectureSession/${courseId}/${session._id}/deadline`,
        { deadline: dates[session._id] },
      );
      const updatedDeadline = response.data.data.deadline;

      setSessions((currentSessions) =>
        currentSessions.map((currentSession) =>
          currentSession._id === session._id
            ? { ...currentSession, deadline: updatedDeadline }
            : currentSession,
        ),
      );
      setDates((currentDates) => ({
        ...currentDates,
        [session._id]: toDateInput(updatedDeadline),
      }));
      setSuccess(`Deadline updated for session #${session._id.slice(-6)}.`);
    } catch (requestError) {
      setError(
        requestError.response?.data?.msg ||
          requestError.message ||
          "Failed to update deadline",
      );
    } finally {
      setSavingSessionId("");
    }
  };

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-sm text-slate-500">Admin / Deadlines</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          Extend Session Deadlines
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Choose a later date for a lecture session. Time is not required.
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
          <h2 className="font-semibold text-slate-900">Lecture Sessions</h2>
        </div>

        {loading ? (
          <p className="p-10 text-center text-sm text-slate-500">
            Loading sessions...
          </p>
        ) : error && sessions.length === 0 ? null : sessions.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">
            No lecture sessions found for this course.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {sessions.map((session) => {
              const currentDate = toDateInput(session.deadline);
              const selectedDate = dates[session._id] || "";
              const canExtend =
                selectedDate && (!currentDate || selectedDate > currentDate);

              return (
                <li
                  key={session._id}
                  className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      Session #{session._id.slice(-6)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Current deadline: {session.deadline || "Not set"}
                    </p>
                  </div>

                  <form
                    onSubmit={(event) => updateDeadline(event, session)}
                    className="flex flex-col gap-2 sm:flex-row sm:items-end"
                  >
                    <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                      New deadline
                      <input
                        type="date"
                        required
                        min={currentDate || undefined}
                        value={selectedDate}
                        onChange={(event) =>
                          setDates((currentDates) => ({
                            ...currentDates,
                            [session._id]: event.target.value,
                          }))
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-600"
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={!canExtend || savingSessionId === session._id}
                      className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {savingSessionId === session._id
                        ? "Saving..."
                        : "Update deadline"}
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Deadlines;
