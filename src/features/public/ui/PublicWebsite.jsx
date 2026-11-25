import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../app/api/axiosInstance";
import TajweedHeroArt from "./TajweedHeroArt";

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
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a href="#home" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-900 text-sm font-bold tracking-wide text-white">
                AIA
              </span>
              <span>
                <span className="block text-sm font-semibold tracking-tight sm:text-base">
                  Aftab Islamic Academy
                </span>
                <span className="hidden text-xs text-slate-500 sm:block">
                  Quran education with Qari Aftab
                </span>
              </span>
            </a>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center justify-between gap-5 border-t border-slate-100 pt-3 text-sm text-slate-600 sm:border-0 sm:pt-0">
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
                className="w-full whitespace-nowrap rounded-lg bg-emerald-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
              >
                {initialized ? accountAction : "Checking..."}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="scroll-mt-8 bg-[#f4f2e9]">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_0.95fr] lg:gap-14 lg:px-8 lg:py-16">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-900">
                Aftab Islamic Academy <span className="px-1 text-amber-700">/</span>{" "}
                Qari Aftab
              </p>
              <h1 className="mt-5 font-serif text-[3.4rem] font-semibold leading-[0.9] tracking-[-0.045em] text-slate-950 sm:text-7xl lg:text-[5.5rem]">
                TAJWEED
                <span className="mt-1 block text-emerald-900">QURAN</span>
              </h1>
              <h2 className="mt-6 max-w-xl text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">
                Learn to recite the Quran with care and correct Tajweed.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Study with experienced Qaris, strengthen your recitation, and
                find Quran Hifz guidance in person or online.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#courses"
                  className="inline-flex min-h-11 items-center justify-center gap-3 rounded-lg bg-emerald-900 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Browse courses <span aria-hidden="true">→</span>
                </a>
                <a
                  href="#about"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white/70 px-5 text-sm font-semibold text-slate-800 transition hover:border-emerald-800 hover:text-emerald-900"
                >
                  Meet Qari Aftab
                </a>
              </div>
              <p className="mt-5 text-sm font-medium text-slate-700">
                Affordable course fees, shown with each course.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="overflow-hidden border border-emerald-950/10 bg-[#e6e5d8]">
                <TajweedHeroArt />
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 border border-white/20 bg-emerald-950 px-4 py-3 text-white sm:bottom-5 sm:left-5 sm:right-5">
                <span className="text-xs font-medium uppercase tracking-wide text-emerald-100">
                  Tajweed &amp; Quran Hifz
                </span>
                <span className="text-sm font-semibold">Qari Aftab</span>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-label="Academy learning options"
          className="border-b border-slate-200 bg-white"
        >
          <div className="mx-auto grid max-w-7xl divide-y divide-slate-200 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
            <article className="py-6 sm:px-6 sm:py-7 sm:first:pl-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
                Tajweed Quran
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Learn pronunciation and recitation rules with Qaris who have
                5–10 years of Tajweed-teaching experience.
              </p>
            </article>
            <article className="py-6 sm:px-6 sm:py-7">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
                Quran Hifz
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Build your memorisation journey with guidance from Qari Aftab
                and the academy&apos;s Qaris.
              </p>
            </article>
            <article className="py-6 sm:py-7 sm:pl-6 sm:last:pr-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
                Learn your way
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Choose from online and in-person learning options at affordable
                fees.
              </p>
            </article>
          </div>
        </section>

        <section
          id="courses"
          className="scroll-mt-8 border-b border-slate-200 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                  Study with us
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  Available courses
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                  Explore Tajweed and Quran learning courses offered by the
                  academy.
                </p>
              </div>
              {!loading && !error && (
                <p className="text-sm text-slate-500">
                  {courses.length} {courses.length === 1 ? "course" : "courses"}
                </p>
              )}
            </div>

            {loading ? (
              <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse border border-slate-200 bg-white"
                  >
                    <div className="aspect-[16/10] bg-slate-100" />
                    <div className="space-y-3 p-5">
                      <div className="h-5 w-2/3 bg-slate-100" />
                      <div className="h-4 bg-slate-100" />
                      <div className="h-4 w-4/5 bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="mt-7 border border-red-200 bg-white p-6">
                <p className="font-semibold text-slate-900">
                  Courses could not be loaded
                </p>
                <p className="mt-2 text-sm text-red-700">{error}</p>
                <button
                  type="button"
                  onClick={retryCourses}
                  className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-800 hover:text-emerald-800"
                >
                  Try again
                </button>
              </div>
            ) : courses.length === 0 ? (
              <p className="mt-7 border border-slate-200 bg-[#f7f6f1] px-5 py-12 text-center text-sm text-slate-600">
                No courses are available right now. Please check back soon.
              </p>
            ) : (
              <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <article
                    key={course._id}
                    className="flex h-full flex-col border border-slate-200 bg-white transition-colors hover:border-emerald-800/40"
                  >
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        loading="lazy"
                        className="aspect-[16/10] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[16/10] items-center justify-center bg-[#f1f3ed] text-sm font-medium text-emerald-900">
                        Aftab Islamic Academy
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                        {course.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
                        {course.description ||
                          "Quran learning with Qari Aftab."}
                      </p>
                      <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                        <span className="text-sm text-slate-500">Course fee</span>
                        <span className="font-semibold text-slate-900">
                          Rs. {formatPrice(course.price)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={goToAccount}
                        disabled={!initialized}
                        className="mt-5 min-h-10 rounded-lg border border-emerald-900 px-4 text-sm font-medium text-emerald-950 transition hover:bg-emerald-900 hover:text-white disabled:cursor-wait disabled:opacity-70"
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
          className="scroll-mt-8 bg-[#f4f2e9] px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
        >
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-14">
            <div className="flex min-h-64 flex-col justify-between bg-emerald-950 p-7 text-white sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">
                Founder &amp; Quran teacher
              </p>
              <div>
                <p className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
                  Qari Aftab
                </p>
                <p className="mt-3 text-sm text-emerald-100">
                  Aftab Islamic Academy
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                Learn from a Qari
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Quran learning, led by Qari Aftab.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                Qari Aftab founded the academy to help students learn Quran
                recitation with Tajweed and pursue Hifz. A skilled Qari with
                experience in both, he teaches students in person and online.
                The academy also brings together Qaris with 5–10 years of
                Tajweed-teaching experience.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700">
                  Tajweed
                </span>
                <span className="border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700">
                  Quran Hifz
                </span>
                <span className="border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700">
                  Online &amp; in person
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Start learning with Aftab Islamic Academy
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Browse available courses and see the fees before you begin.
              </p>
            </div>
            <a
              href="#courses"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-3 rounded-lg bg-emerald-900 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              View courses <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-[#f7f6f1] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-slate-900">Aftab Islamic Academy</p>
          <p>Quran education with Qari Aftab.</p>
          <a href="#home" className="font-medium text-emerald-900 hover:underline">
            Back to top
          </a>
        </div>
      </footer>
    </div>
  );
}

export default PublicWebsite;
