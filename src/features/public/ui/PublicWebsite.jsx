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
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 px-4 py-4 sm:px-6 lg:px-8">
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

          <div className="order-3 flex w-full items-center gap-6 border-t border-slate-100 pt-3 text-sm text-slate-600 sm:w-auto sm:border-0 sm:pt-0 md:order-2">
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
            className="order-2 rounded-lg bg-emerald-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70 sm:order-3"
          >
            {initialized ? accountAction : "Checking..."}
          </button>
        </nav>
      </header>

      <main>
        <section id="home" className="scroll-mt-8 bg-[#f7f6f1]">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                Aftab Islamic Academy
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-[3.5rem]">
                Learn the Quran with Qari Aftab.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                Explore the academy&apos;s courses and find the right next step
                in your Quran learning.
              </p>
              <a
                href="#courses"
                className="mt-8 inline-flex min-h-11 items-center gap-3 rounded-lg bg-emerald-900 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Explore courses
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <figure className="relative mx-auto w-full max-w-xl">
              {courses[0]?.thumbnail ? (
                <img
                  src={courses[0].thumbnail}
                  alt={courses[0].title}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] flex-col justify-between bg-emerald-900 p-7 text-white sm:p-10">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-100">
                    Quran education
                  </p>
                  <p className="max-w-sm font-serif text-4xl leading-tight sm:text-5xl">
                    A thoughtful place to learn.
                  </p>
                  <p className="text-sm text-emerald-100">Qari Aftab</p>
                </div>
              )}
              {courses[0] && (
                <figcaption className="flex items-center justify-between gap-4 border border-t-0 border-slate-200 bg-white px-4 py-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Featured course
                  </span>
                  <span className="truncate text-sm font-semibold text-slate-900">
                    {courses[0].title}
                  </span>
                </figcaption>
              )}
            </figure>
          </div>
        </section>

        <section
          id="courses"
          className="scroll-mt-8 border-b border-slate-200 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                  Study with us
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  Our courses
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  Browse the courses currently offered by the academy.
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
          className="scroll-mt-8 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                About the academy
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Aftab Islamic Academy
              </h2>
            </div>
            <div className="max-w-3xl">
              <p className="text-lg leading-8 text-slate-700">
                Led by Qari Aftab, the academy brings its Quran courses
                together in one place. Browse the available programs and use
                your student account to continue learning.
              </p>
              <p className="mt-5 text-sm font-medium text-slate-500">
                Qari Aftab · Quran teacher
              </p>
            </div>
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
