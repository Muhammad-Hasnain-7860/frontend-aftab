import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../app/api/axiosInstance";
import TajweedHeroArt from "./TajweedHeroArt";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-PK").format(Number(price) || 0);

const currentYear = new Date().getFullYear();

const tajweedStudents = [
  "احمد محمود",
  "مشیر احمد",
  "دلشیر علی",
  "خلیل احمد",
  "محمد محدث",
  "محمد عاصم",
  "عمران عطاری",
  "مولانا عبدالغنی",
  "الطاف حسین عطاری",
  "محمد دین",
  "نعمان علی",
  "سرفراز عطاری",
  "حافظ عمیر",
  "عرفان قادری",
  "عبدالجبار مدنی",
  "حافظ مزمل",
  "حافظ غلام طٰہ",
  "حافظ مقصود",
  "حافظ محمد شاہ جہان",
  "حافظ اللہ بخش قادری",
  "حافظ محمد طیب",
  "حافظ اسداللہ",
];

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
                <a className="transition hover:text-emerald-800" href="#students">
                  Students
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
                Learn pronunciation and recitation rules with Qari Aftab, who
                has 20 years of Quran-teaching experience.
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
          className="scroll-mt-8 border-b border-slate-200 bg-[#f4f2e9] px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 border-b border-slate-300 pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                  Course catalogue
                </p>
                <h2 className="mt-2 max-w-2xl font-serif text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Choose your Quran learning path.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Explore Tajweed and Hifz courses, see the fees upfront, and
                  choose how you would like to learn.
                </p>
                <p className="mt-3 text-sm text-slate-700">
                  To purchase a course,{" "}
                  <a
                    href="https://wa.me/923066972896?text=Assalam-o-Alaikum%2C%20mujhe%20course%20ke%20bare%20mein%20maloomat%20chahiye."
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-emerald-900 underline decoration-emerald-700 underline-offset-4 hover:text-emerald-700"
                  >
                    contact us on WhatsApp: 0306 6972896
                  </a>
                  .
                </p>
              </div>
              {!loading && !error && (
                <p className="shrink-0 text-sm font-medium text-slate-600">
                  {courses.length} {courses.length === 1 ? "course" : "courses"}
                </p>
              )}
            </div>

            {loading ? (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse overflow-hidden border border-slate-200 bg-white"
                  >
                    <div className="aspect-[16/9] bg-slate-200" />
                    <div className="space-y-3 p-5">
                      <div className="h-5 w-2/3 bg-slate-100" />
                      <div className="h-4 bg-slate-100" />
                      <div className="h-4 w-4/5 bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="mt-8 border border-red-200 bg-white p-6">
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
              <p className="mt-8 border border-slate-300 bg-white px-5 py-12 text-center text-sm text-slate-600">
                No courses are available right now. Please check back soon.
              </p>
            ) : (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <article
                    key={course._id}
                    className="group flex h-full flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-900/40 hover:shadow-lg"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#e6e5d8]">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <TajweedHeroArt />
                      )}
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-emerald-950/85 to-transparent px-4 pb-4 pt-12 text-white">
                        <span className="text-xs font-medium uppercase tracking-wide text-emerald-50">
                          Quran course
                        </span>
                        <span className="text-xs font-medium text-amber-100">
                          Qari Aftab
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
                        Aftab Islamic Academy
                      </p>
                      <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-slate-950">
                        {course.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
                        {course.description ||
                          "Learn Quran recitation and Tajweed with the academy."}
                      </p>
                      <div className="mt-auto">
                        <div className="mt-5 border-t border-slate-200 pt-4">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Course fee
                          </p>
                          <p className="mt-1 text-2xl font-semibold tracking-tight text-emerald-950">
                            Rs. {formatPrice(course.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={goToAccount}
                          disabled={!initialized}
                          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-900 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70"
                        >
                          {initialized ? accountAction : "Checking..."}
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section
          id="students"
          className="relative scroll-mt-8 overflow-hidden bg-emerald-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-emerald-800/40 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl">
            <h2
              lang="ar"
              dir="rtl"
              className="mb-2 text-center font-serif text-3xl font-semibold text-amber-100 sm:text-4xl"
            >
              تخصص في التجويد
            </h2>
            <p className="mb-6 text-center text-sm text-emerald-100 sm:mb-8 sm:text-base">
              A few of Qari Aftab&apos;s students are shown here.
            </p>

            <div className="border border-emerald-900 bg-[#f4f2e9] p-4 text-slate-900 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tajweedStudents.map((name) => (
                  <p
                    key={name}
                    lang="ur"
                    dir="rtl"
                    className="border border-slate-200 bg-white px-4 py-3 text-right font-serif text-lg font-semibold text-slate-900 sm:text-xl"
                  >
                    {name}
                  </p>
                ))}
              </div>
            </div>
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
                recitation with Tajweed and pursue Hifz. He has 20 years of
                Quran-teaching experience and has completed the Muallim
                Tajweed-o-Qira&apos;at Course. He teaches students online and in
                person.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700">
                  Tajweed
                </span>
                <span className="border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700">
                  Quran Hifz
                </span>
                <span className="border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700">
                  Muallim Tajweed-o-Qira&apos;at Course
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

      <footer className="bg-emerald-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-9 px-4 py-10 sm:grid-cols-2 sm:px-6 sm:py-12 lg:grid-cols-[1.4fr_0.7fr_0.9fr] lg:px-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#home" className="inline-flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center border border-emerald-700 text-sm font-bold tracking-wide text-amber-100">
                AIA
              </span>
              <span className="text-lg font-semibold tracking-tight">
                Aftab Islamic Academy
              </span>
            </a>
            <p className="mt-4 text-sm text-emerald-100">
              Quran learning with Qari Aftab.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">
              Explore
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-emerald-100">
              <li>
                <a className="transition hover:text-white" href="#courses">
                  Courses
                </a>
              </li>
              <li>
                <a className="transition hover:text-white" href="#students">
                  Students
                </a>
              </li>
              <li>
                <a className="transition hover:text-white" href="#about">
                  About the academy
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">
              Contact
            </h2>
            <a
              href="https://wa.me/923066972896"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm text-emerald-100 transition hover:text-white"
            >
              WhatsApp: 0306 6972896
            </a>
          </div>
        </div>

     
      </footer>

      <a
        href="https://wa.me/923066972896"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Aftab Islamic Academy on WhatsApp"
        title="Chat on WhatsApp"
        className="group fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#168c54] text-white shadow-lg shadow-emerald-950/20 transition hover:-translate-y-1 hover:bg-[#117444] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900 sm:bottom-7 sm:right-7 sm:h-16 sm:w-16"
      >
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap bg-white px-3 py-2 text-sm font-medium text-slate-800 opacity-0 shadow-md transition group-hover:opacity-100 group-focus-visible:opacity-100">
          Chat on WhatsApp
        </span>
        <svg
          aria-hidden="true"
          className="h-7 w-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        >
          <path d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2L4 20l1.2-4.1a8.2 8.2 0 1 1 15-4.2Z" />
          <path d="M9 8.2c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .5.4l.8 1.9c.1.2.1.4 0 .6l-.5.7c-.2.2-.2.3-.1.5.2.4.7 1.1 1.4 1.7.8.7 1.5 1 1.9 1.2.2.1.4.1.5-.1l.7-.8c.2-.2.4-.3.6-.2l1.8.9c.3.1.4.2.4.4 0 .3-.2 1.2-.8 1.7-.5.5-1.2.7-1.8.6-.5-.1-1.2-.3-2.1-.7-1.1-.5-2-1.2-2.9-2.1-.8-.8-1.5-1.8-1.9-2.7-.4-.9-.6-1.7-.6-2.2 0-.6.3-1.1.9-1.5Z" />
        </svg>
      </a>

     
    </div>
  );
}

export default PublicWebsite;
