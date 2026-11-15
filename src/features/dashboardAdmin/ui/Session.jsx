import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { axiosInstance } from "../../../app/api/axiosInstance";
import { useNavigate } from "react-router";

function AllLectureSession() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { courseId } = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    fetchSessions();
  }, [courseId]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(`/lectureSession/${courseId}`);

      setSessions(response.data.data || []);
    } catch (error) {
      setError(error.response?.data?.msg || "Failed to fetch sessions.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      active: "bg-emerald-50 text-emerald-700",
      scheduled: "bg-blue-50 text-blue-700",
      completed: "bg-slate-100 text-slate-600",
    };

    return styles[status] || "bg-slate-100 text-slate-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <p className="text-sm text-slate-500">Admin / Sessions</p>
        <h1 className="text-2xl font-semibold text-slate-900 mt-1">
          All Sessions
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Manage and monitor all lecture sessions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <p className="text-sm text-slate-500">Total Sessions</p>
          <h2 className="text-3xl font-semibold text-slate-900 mt-2">
            {sessions.length}
          </h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <p className="text-sm text-slate-500">Active Sessions</p>
          <h2 className="text-3xl font-semibold text-emerald-700 mt-2">
            {sessions.filter((session) => session.status === "active").length}
          </h2>
        </div>
      </div>

      {/* Sessions */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Session List</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            Loading sessions...
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchSessions}
              className="mt-3 text-sm text-emerald-700 font-medium"
            >
              Try again
            </button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-medium text-slate-700">No sessions found</p>
            <p className="text-sm text-slate-400 mt-1">
              Sessions will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    Session #{session._id.slice(-6)}
                  </p>

                  <p className="text-sm text-slate-500 mt-2">
                    Deadline: {session.deadline || "Not set"}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Created: {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(session.status)}`}
                  >
                    {session.status}
                  </span>

                  <button
                    onClick={() =>
                      navigate(
                        `/admin/dashboard/${courseId}/sessions/${session._id}`,
                      )
                    }
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllLectureSession;
