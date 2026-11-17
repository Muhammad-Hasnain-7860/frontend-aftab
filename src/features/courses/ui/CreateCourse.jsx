import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../hook/useAuth";
import { axiosInstance } from "../../../app/api/axiosInstance";
import toast from "react-hot-toast";

const CreateCourse = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, handleError, isSubmitting } = useAuth();
  const [preview, setPreview] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState("");

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setError("");

    if (!thumbnail) {
      return toast.error("Thumbnail is required");
    }

    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("detail", data.detail);
      formData.append("price", data.price);
      formData.append("thumbnail", thumbnail);

      const { data: response } = await axiosInstance.post(
        "/course/create",
        formData,
      );

      console.log(data);

      toast.success(response.msg || "Course created successfully");
      navigate("/admin/courses");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/courses")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
          >
            <span>←</span> Back to Courses
          </button>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
              Course Management
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Create a new course
            </h1>
            <p className="max-w-xl text-sm leading-6 text-slate-500">
              Add the course information, upload a thumbnail and set the price.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit, handleError)}>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Main Form */}
            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6 border-b border-slate-100 pb-5">
                  <h2 className="text-base font-bold text-slate-900">
                    Basic Information
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Enter the main details of your course.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Course Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("title", {
                        required: "Course title is required",
                        minLength: {
                          value: 3,
                          message: "Title must be at least 3 characters",
                        },
                      })}
                      placeholder="e.g. Quran Memorization"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register("description", {
                        required: "Course description is required",
                        minLength: {
                          value: 10,
                          message: "Description must be at least 10 characters",
                        },
                      })}
                      rows={3}
                      placeholder="Write a short introduction about this course..."
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                    />
                    <p className="mt-2 text-xs text-slate-400">
                      A brief overview students will see on the course card.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Course Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register("detail", {
                        required: "Course detail is required",
                        minLength: {
                          value: 20,
                          message: "Details must be at least 20 characters",
                        },
                      })}
                      rows={7}
                      placeholder="Describe what students will learn, course topics and learning outcomes..."
                      className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                    />
                  </div>
                </div>
              </section>

              {/* Thumbnail */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-5">
                  <h2 className="text-base font-bold text-slate-900">
                    Course Thumbnail
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Upload an attractive image for your course.
                  </p>
                </div>

                <label className="group flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-emerald-400 hover:bg-emerald-50/40">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Course thumbnail preview"
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center px-5 py-12 text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                        <svg
                          className="h-7 w-7"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16V4m0 0L7 9m5-5l5 5M5 16v3a1 1 0 001 1h12a1 1 0 001-1v-3"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">
                        Click to upload thumbnail
                      </p>
                      <p className="mt-2 text-xs text-slate-400">
                        PNG, JPG or WEBP
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    {...register("thumbnail", {
                      required: "Course thumbnail is required",
                      validate: {
                        imageOnly: (files) =>
                          files[0]?.type.startsWith("image/") ||
                          "Please select a valid image",
                      },
                      onChange: handleImage,
                    })}
                  />
                </label>

                {preview && (
                  <button
                    type="button"
                    onClick={() => setPreview(null)}
                    className="mt-3 text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Remove thumbnail
                  </button>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-base font-bold text-slate-900">Pricing</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Set the enrollment price.
                </p>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Course Price
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50">
                    <span className="border-r border-slate-200 px-3 py-3 text-sm font-semibold text-slate-500">
                      PKR
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      className="min-w-0 w-full rounded-r-xl px-3 py-3 text-sm outline-none"
                      {...register("price", {
                        required: "Course price is required",
                        valueAsNumber: true,
                        min: {
                          value: 0,
                          message: "Price cannot be negative",
                        },
                      })}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                <h3 className="text-sm font-bold text-emerald-900">
                  Before publishing
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-emerald-800">
                  <li>• Add a clear course title</li>
                  <li>• Write a helpful description</li>
                  <li>• Include complete course details</li>
                  <li>• Upload a relevant thumbnail</li>
                  <li>• Set the correct price</li>
                </ul>
              </section>
            </aside>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-end sm:p-5">
            <button
              type="button"
              onClick={() => navigate("/admin/courses")}
              className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-emerald-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
