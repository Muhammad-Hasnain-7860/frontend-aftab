
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../app/api/axiosInstance";
import { useNavigate, useParams } from "react-router";

function AllLecture() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [audioUrls, setAudioUrls] = useState({});

    const { courseId } = useParams();

    const navigate = useNavigate()

  useEffect(() => {
    fetchLectures();
  }, [courseId]);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(`/lecture/${courseId}`);
      setLectures(response.data.data || []);
    } catch (error) {
      setError(error.response?.data?.msg || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = async (lecture) => {
    try {
      setError("");

      const response = await axiosInstance.get("/audio/audio-url", {
        params: { key: lecture.audioKey },
      });

      setAudioUrls((prev) => ({
        ...prev,
        [lecture._id]: response.data.url,
      }));
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load audio."
      );
    }
  };

  const filteredLectures = lectures.filter((lecture) =>
    lecture.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Admin / Lectures</p>
          <h1 className="text-2xl font-semibold text-slate-900 mt-1">
            All Lectures
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Manage and listen to your uploaded lectures.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/upload-lecture')}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-3 rounded-xl font-medium transition"
        >
          + Upload Lecture
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <p className="text-sm text-slate-500">Total Lectures</p>
          <h2 className="text-3xl font-semibold text-slate-900 mt-2">
            {lectures.length}
          </h2>
          <p className="text-xs text-slate-400 mt-1">Uploaded lectures</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <p className="text-sm text-slate-500">Search Results</p>
          <h2 className="text-3xl font-semibold text-slate-900 mt-2">
            {filteredLectures.length}
          </h2>
          <p className="text-xs text-slate-400 mt-1">Matching lectures</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <input
          type="text"
          placeholder="Search lectures by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Lecture List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Lecture Library</h2>
          <p className="text-sm text-slate-500 mt-1">
            All your uploaded lectures in one place.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            Loading lectures...
          </div>
        ) : error && lectures.length === 0 ? (
          <div className="p-6">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-700">
                Failed to load lectures
              </p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              <button
                onClick={fetchLectures}
                className="mt-3 text-sm font-medium text-red-700 underline"
              >
                Try again
              </button>
            </div>
          </div>
        ) : filteredLectures.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-medium text-slate-700">No lectures found</p>
            <p className="text-sm text-slate-400 mt-1">
              Try another search or upload a new lecture.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLectures.map((lecture) => (
              <div
                key={lecture._id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl">
                    ♫
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-medium text-slate-900 truncate">
                      {lecture.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {lecture.createdAt
                        ? new Date(lecture.createdAt).toLocaleDateString()
                        : "Date unavailable"}
                    </p>
                  </div>
                </div>

                {!audioUrls[lecture._id] ? (
                  <button
                    onClick={() => handlePlayAudio(lecture)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium"
                  >
                    Get Audio
                  </button>
                ) : (
                  <audio
                    controls
                    preload="none"
                    src={audioUrls[lecture._id]}
                    className="w-full sm:w-64 h-10"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && lectures.length > 0 && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default AllLecture;
