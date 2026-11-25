import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { lectureCreateApi } from "../apis/LectureApi";
import { useNavigate, useParams } from "react-router";

const MAX_AUDIO_MB = 30;
const MAX_IMAGE_MB = 30;

const inputBase =
  "w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2";

const inputClass = (hasError) =>
  `${inputBase} ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
      : "border-gray-300 focus:border-emerald-600 focus:ring-emerald-600/20"
  }`;

const formatSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const Field = ({ label, required, error, hint, children }) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
    {children}
    {error ? (
      <p className="mt-1.5 text-xs text-red-600">{error}</p>
    ) : (
      hint && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
    )}
  </div>
);

const  LectureUploadForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { title: "", description: "" },
  });

  const {courseId} = useParams()
  const navigate = useNavigate()

  const descriptionLength = watch("description")?.length || 0;
  const audioFile = watch("audio")?.[0];
  const imageFile = watch("image")?.[0];

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title.trim());
    formData.append("description", data.description.trim());
    formData.append('courseId' , courseId)
    formData.append("audio", data.audio[0]);
    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      await lectureCreateApi(formData);
      toast.success("Lecture uploaded successfully");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.msg || err.message);
    }
  };

  const onError = (formErrors) => {
    const firstKey = Object.keys(formErrors)[0];
    if (firstKey) toast.error(formErrors[firstKey].message);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      noValidate
      className="rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      {/* Lecture details */}
      <div className="space-y-5 p-6">
        <button
  type="button"
  onClick={() => navigate(`/admin/dashboard/${courseId}`)}
  className="mb-5 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
>
  <icon name="arrow-left" size="16" />
  Back
</button>
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Lecture details
          </h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Title aur description students ko dikhayi jayegi.
          </p>
        </div>

        <Field label="Lecture title" required error={errors.title?.message}>
          <input
            type="text"
            placeholder="e.g. Surah Al-Mulk, Ayat 1-5"
            {...register("title", {
              required: "Title is required",
              maxLength: {
                value: 120,
                message: "Title 120 characters se zyada nahi ho sakta",
              },
            })}
            className={inputClass(errors.title)}
          />
        </Field>

        <Field
          label="Description"
          required
          error={errors.description?.message}
          hint={`${descriptionLength}/500 characters`}
        >
          <textarea
            rows={4}
            placeholder="Lecture ka short summary likhein"
            {...register("description", {
              required: "Description is required",
              maxLength: {
                value: 500,
                message: "Description 500 characters se zyada nahi ho sakti",
              },
            })}
            className={`${inputClass(errors.description)} resize-none`}
          />
        </Field>
      </div>

      <div className="border-t border-gray-200" />

      {/* Optional image */}
      <div className="space-y-5 p-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Lecture image (optional)
          </h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Image upload karein, maximum {MAX_IMAGE_MB} MB.
          </p>
        </div>

        <Field label="Upload image" error={errors.image?.message}>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center transition hover:border-emerald-600 hover:bg-emerald-50/50">
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              {...register("image", {
                validate: {
                  imageOnly: (files) =>
                    !files?.[0] ||
                    files[0].type.startsWith("image/") ||
                    "Sirf image files allowed hain",
                  maxSize: (files) =>
                    !files?.[0] ||
                    files[0].size <= MAX_IMAGE_MB * 1024 * 1024 ||
                    `Image ${MAX_IMAGE_MB} MB se chhoti honi chahiye`,
                },
              })}
            />
            {imageFile ? (
              <>
                <span className="text-sm font-medium text-gray-900">
                  {imageFile.name}
                </span>
                <span className="mt-1 text-xs text-gray-500">
                  {formatSize(imageFile.size)} · Change karne ke liye click
                  karein
                </span>
              </>
            ) : (
              <span className="text-sm font-medium text-emerald-700">
                Click karke image select karein
              </span>
            )}
          </label>
        </Field>
      </div>

      <div className="border-t border-gray-200" />

      {/* Audio */}
      <div className="space-y-5 p-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Audio file</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            MP3, WAV ya M4A format, maximum {MAX_AUDIO_MB} MB.
          </p>
        </div>

        <Field label="Upload audio" required error={errors.audio?.message}>
          <label
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center transition hover:border-emerald-600 hover:bg-emerald-50/50 ${
              errors.audio
                ? "border-red-400 bg-red-50/30"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <input
              type="file"
              accept="audio/*"
              className="sr-only"
              {...register("audio", {
                required: "Audio file is required",
                validate: {
                  audioOnly: (files) =>
                    files?.[0]?.type.startsWith("audio/") ||
                    "Sirf audio files allowed hain",
                  maxSize: (files) =>
                    files?.[0]?.size <= MAX_AUDIO_MB * 1024 * 1024 ||
                    `File ${MAX_AUDIO_MB} MB se chhoti honi chahiye`,
                },
              })}
            />

            {audioFile ? (
              <>
                <span className="text-sm font-medium text-gray-900">
                  {audioFile.name}
                </span>
                <span className="mt-1 text-xs text-gray-500">
                  {formatSize(audioFile.size)} · Change karne ke liye click
                  karein
                </span>
              </>
            ) : (
              <>
                <span className="text-sm font-medium text-emerald-700">
                  Click karke audio file select karein
                </span>
                <span className="mt-1 text-xs text-gray-500">
                  Ya file yahan drag karke chhodein
                </span>
              </>
            )}
          </label>
        </Field>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 rounded-b-xl border-t border-gray-200 bg-gray-50 px-6 py-4">
        <button
          type="button"
          onClick={() => reset()}
          disabled={isSubmitting}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Uploading..." : "Upload Lecture"}
        </button>
      </div>
    </form>
  );
};

export default LectureUploadForm;
