import LectureUploadForm from "./LectureUploadForm";

const LectureUpload = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Upload Lecture
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Add a new audio lecture to your course.
          </p>
        </div>

        <LectureUploadForm />
      </div>
    </div>
  );
};

export default LectureUpload;