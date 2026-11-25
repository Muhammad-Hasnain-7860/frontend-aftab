import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../app/api/axiosInstance";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-PK").format(Number(price) || 0);

const fetchPublicCourses = async () => {
  const response = await axiosInstance.get("/course/public");
  return response.data.data || [];
};

const getCourseError = (requestError) =>
  requestError.response?.data?.msg ||
  requestError.message ||
  "Courses could not be loaded.";

function PublicWebsite() {
  const navigate = useNavigate();
  const { user, initialized } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const retryCourses = async () => {
    setLoading(true);
    setError("");

    try {
      setCourses(await fetchPublicCourses());
    } catch (requestError) {
      setError(getCourseError(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    fetchPublicCourses()
      .then((loadedCourses) => {
        if (!cancelled) setCourses(loadedCourses);
      })
      .catch((requestError) => {
        if (!cancelled) setError(getCourseError(requestError));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const goToAccount = () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    navigate(user.role === "admin" ? "/admin/courses" : "/student/dashboard");
  };

  const accountAction = user ? "Go to Courses" : "Go Auth";

  return (
    <div className="min-h-screen bg-[#fbfaf6] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-emerald-950/10 bg-[#fbfaf6]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="#" className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-900 text-amber-300">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" />
                <path d="M4 6h13M8 8.5v7m-3.5-3.5h7" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold tracking-tight sm:text-base">
                Aftab Islamic Academy
              </span>
              <span className="hidden text-xs text-slate-500 sm:block">
                Learn Quran with Qari Aftab
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a className="transition hover:text-emerald-800" href="#home">
              Home
            </a>
            <a className="transition hover:text-emerald-800" href="#courses">
              Courses
            </a>
            <a className="transition hover:text-emerald-800" href="#about">
              About
            </a>
          </div>

          <button
            type="button"
            onClick={goToAccount}
            disabled={!initialized}
            className="shrink-0 rounded-full bg-emerald-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70 sm:px-5 sm:text-sm"
          >
            {initialized ? accountAction : "Checking..."}
          </button>
        </nav>
      </header>

      <main>
        <section
          id="home"
          className="relative isolate overflow-hidden border-b border-emerald-950/5"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_15%,rgba(217,180,93,0.2),transparent_38%),linear-gradient(135deg,#fbfaf6_0%,#f0f4e9_100%)]" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-900">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                A welcoming place to learn
              </div>
              <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Bring the Quran closer to your{" "}
                <span className="text-emerald-800">everyday life.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Explore Quran learning courses at Aftab Islamic Academy with
                Qari Aftab. Find a course that fits your learning journey.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#courses"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-900 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Explore courses
                  <span className="ml-2" aria-hidden="true">
                    ↓
                  </span>
                </a>
                <button
                  type="button"
                  onClick={goToAccount}
                  disabled={!initialized}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-emerald-900/20 bg-white/70 px-6 text-sm font-semibold text-emerald-950 transition hover:bg-white disabled:cursor-wait disabled:opacity-70"
                >
                  {initialized ? accountAction : "Checking account..."}
                </button>
              </div>
              <div className="mt-10 flex items-center gap-3 text-sm text-slate-600">
                <span className="flex -space-x-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#fbfaf6] bg-emerald-900 text-amber-300">
                    Q
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#fbfaf6] bg-amber-200 text-emerald-950">
                    ن
                  </span>
                </span>
                <span>
                  Guided by <strong className="text-slate-900">Qari Aftab</strong>
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-4 rounded-[2rem] bg-amber-200/40 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-emerald-950 p-6 text-white shadow-2xl shadow-emerald-950/15 sm:p-9">
                <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-amber-200/15" />
                <div className="absolute -right-8 -top-12 h-48 w-48 rounded-full border border-amber-200/15" />
                <div className="relative flex min-h-[300px] flex-col justify-between sm:min-h-[350px]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                        Aftab Islamic Academy
                      </p>
                      <p className="mt-2 text-sm text-emerald-100/70">
                        A thoughtful learning journey
                      </p>
                    </div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-amber-200">
                      <svg
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M3 6.5 12 3l9 3.5v11L12 21l-9-3.5v-11Z" />
                        <path d="M3.5 7 12 10l8.5-3M12 10v10.5" />
                      </svg>
                    </span>
                  </div>
                  <div className="py-8 text-center">
                    <p className="font-serif text-5xl leading-tight text-amber-100 sm:text-6xl">
                      اقرأ
                    </p>
                    <div className="mx-auto mt-5 h-px w-20 bg-amber-300/50" />
                    <p className="mt-5 text-sm text-emerald-100/80">
                      Begin with a single step
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-5 text-sm">
                    <span className="text-emerald-100/70">Learn at your pace</span>
                    <span className="font-medium text-amber-200">With Qari Aftab</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="courses" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                  Find your path
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Courses for your journey
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Browse the courses available at Aftab Islamic Academy.
                </p>
              </div>
              {!loading && !error && (
                <p className="text-sm font-medium text-slate-500">
                  {courses.length} {courses.length === 1 ? "course" : "courses"}
                </p>
              )}
            </div>

            {loading ? (
              <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <div className="aspect-[16/10] bg-slate-200" />
                    <div className="space-y-3 p-5">
                      <div className="h-5 w-2/3 rounded bg-slate-200" />
                      <div className="h-4 rounded bg-slate-100" />
                      <div className="h-4 w-4/5 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="mt-9 rounded-2xl border border-red-200 bg-white p-6">
                <p className="font-semibold text-slate-900">
                  Courses could not be loaded
                </p>
                <p className="mt-2 text-sm text-red-700">{error}</p>
                <button
                  type="button"
                  onClick={retryCourses}
                  className="mt-4 rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Try again
                </button>
              </div>
            ) : courses.length === 0 ? (
              <div className="mt-9 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
                <p className="text-lg font-semibold text-slate-900">
                  New courses are on the way
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Please check back soon for available courses.
                </p>
              </div>
            ) : (
              <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <article
                    key={course._id}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-emerald-50">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-900 to-emerald-700 text-5xl text-amber-200">
                          ﷽
                        </div>
                      )}
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-950 backdrop-blur">
                        Quran course
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
                        Aftab Islamic Academy
                      </p>
                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                        {course.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
                        {course.description ||
                          "Explore this Quran learning course with Qari Aftab."}
                      </p>
                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="text-xs text-slate-500">Course fee</span>
                        <span className="font-semibold text-slate-900">
                          Rs. {formatPrice(course.price)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={goToAccount}
                        disabled={!initialized}
                        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-emerald-900/15 bg-emerald-50 px-5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100 disabled:cursor-wait disabled:opacity-70"
                      >
                        {initialized ? accountAction : "Checking..."}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section
          id="about"
          className="scroll-mt-24 border-y border-emerald-950/5 bg-[#f0f4e9] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div className="rounded-3xl bg-emerald-900 p-7 text-white sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                Your learning guide
              </p>
              <p className="mt-4 text-3xl font-semibold tracking-tight">
                Qari Aftab
              </p>
              <p className="mt-2 text-sm text-emerald-100/75">
                Quran teacher at Aftab Islamic Academy
              </p>
              <div className="mt-7 h-px bg-white/15" />
              <p className="mt-5 font-serif text-3xl text-amber-100">بِسْمِ اللَّهِ</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                About the academy
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                A welcoming place to grow in Quran learning.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                Aftab Islamic Academy, led by Qari Aftab, brings Quran courses
                together in one place. Explore the available learning options
                and choose the next step that feels right for you.
              </p>
              <a
                href="#courses"
                className="mt-7 inline-flex items-center font-semibold text-emerald-900 hover:text-emerald-700"
              >
                View available courses
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-emerald-950 px-6 py-9 text-white sm:px-10 sm:py-12 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                Start your journey
              </p>
              <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
                Find a course and take your next step.
              </h2>
            </div>
            <button
              type="button"
              onClick={goToAccount}
              disabled={!initialized}
              className="min-h-12 shrink-0 rounded-full bg-amber-300 px-6 text-sm font-bold text-emerald-950 transition hover:bg-amber-200 disabled:cursor-wait disabled:opacity-70"
            >
              {initialized ? accountAction : "Checking..."}
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-slate-800">Aftab Islamic Academy</p>
          <p>Quran learning with Qari Aftab.</p>
          <a href="#home" className="font-medium text-emerald-800 hover:text-emerald-700">
            Back to top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}

export default PublicWebsite;
