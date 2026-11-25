
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../app/api/axiosInstance";
import { useNavigate, useParams } from "react-router";
import LectureImagePreview from "../../lecture/ui/LectureImagePreview";
import AudioPlayer from "../../lecture/ui/AudioPlayer";

function AllLecture() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [audioUrls, setAudioUrls] = useState({});
  const [loadingAudioId, setLoadingAudioId] = useState("");

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
      setLoadingAudioId(lecture._id);

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
    } finally {
      setLoadingAudioId("");
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
                <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                  {lecture.imageUrl ? (
                    <LectureImagePreview
                      imageUrl={lecture.imageUrl}
                      title={lecture.title}
                      className="sm:w-52"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-700">
                      ♫
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
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
                    type="button"
                    onClick={() => handlePlayAudio(lecture)}
                    disabled={loadingAudioId === lecture._id}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70"
                  >
                    {loadingAudioId === lecture._id && (
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6V3Z"
                        />
                      </svg>
                    )}
                    {loadingAudioId === lecture._id ? "Loading..." : "Get Audio"}
                  </button>
                ) : (
                  <AudioPlayer
                    src={audioUrls[lecture._id]}
                    preload="none"
                    className="w-full sm:w-64"
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
