import { useRef, useState } from "react";
import "./App.css";
import { axiosInstance } from "./app/api/axiosInstance";
import * as tus from "tus-js-client";
import { useEffect } from "react";

function App() {
  const inpRef = useRef(null);
  const [credentials, setCredentials] = useState(false);
  const [check, setCheck] = useState(false);
  const isCreating = useRef(false);
  const [showError, setShowError] = useState(false);

  const getErrorMessage = (error) => {
    return (
      error.response?.data?.msg ||
      error.response?.data?.data ||
      error.message ||
      "Something went wrong"
    );
  };

  const handleClick = async () => {
    if (isCreating.current || credentials) return;

    isCreating.current = true;
    setCheck(true);

    try {
      const response = await axiosInstance.post(
        "/lecture/video-create",
        {
          title: inpRef.current.value,
        },
        {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZWMzYTNhNzc5Y2MzYTUwNTg3YmI4MSIsInJvbGUiOiJzdHVkZW50Iiwic2Vzc2lvbklkIjoiNmFlYzNhM2E3NzljYzNhNTA1ODdiYjgyIiwiaWF0IjoxNzkzODY2Mjk4LCJleHAiOjE3OTM5NTI2OTh9.3ZSY_T5fXqsWguXIO2qfCh0cTlNmPBioSzub5nHp7AU",
          },
        },
      );

      if (!response.data?.data?.videoId) {
        return setShowError(getErrorMessage(error));
      }

      try {
        const response2 = await axiosInstance.post(
          `/lecture/upload-auth/${response.data.data.videoId}`,
          {},
          {
            headers: {
              Authorization:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZWMzYTNhNzc5Y2MzYTUwNTg3YmI4MSIsInJvbGUiOiJzdHVkZW50Iiwic2Vzc2lvbklkIjoiNmFlYzNhM2E3NzljYzNhNTA1ODdiYjgyIiwiaWF0IjoxNzkzODY2Mjk4LCJleHAiOjE3OTM5NTI2OTh9.3ZSY_T5fXqsWguXIO2qfCh0cTlNmPBioSzub5nHp7AU",
            },
          },
        );

        if (
          !response2.data?.data?.videoId ||
          !response2.data?.data?.libraryId ||
          !response2.data?.data?.authorizationSignature ||
          !response2.data?.data?.authorizationExpire
        ) {
          throw new Error("Upload authorization data not found in response");
        }

        setCredentials(response2.data.data);
      } catch (error) {
        setShowError(getErrorMessage(error));
        setCredentials(false);
        axiosInstance
          .get("/lecture/active-check", { headers: { Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZWMzYTNhNzc5Y2MzYTUwNTg3YmI4MSIsInJvbGUiOiJzdHVkZW50Iiwic2Vzc2lvbklkIjoiNmFlYzNhM2E3NzljYzNhNTA1ODdiYjgyIiwiaWF0IjoxNzkzODY2Mjk4LCJleHAiOjE3OTM5NTI2OTh9.3ZSY_T5fXqsWguXIO2qfCh0cTlNmPBioSzub5nHp7AU" } })
          .catch((e) => setShowError(getErrorMessage(e)));
      }
    } catch (error) {
     return setShowError(getErrorMessage(error));
    } finally {
      isCreating.current = false;
      setCheck(false);
    }
  };

  const refreshCredentials = async (videoId) => {
    const response = await axiosInstance.post(
      `/lecture/upload-auth/${videoId}`,
      {},
      {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZWMzYTNhNzc5Y2MzYTUwNTg3YmI4MSIsInJvbGUiOiJzdHVkZW50Iiwic2Vzc2lvbklkIjoiNmFlYzNhM2E3NzljYzNhNTA1ODdiYjgyIiwiaWF0IjoxNzkzODY2Mjk4LCJleHAiOjE3OTM5NTI2OTh9.3ZSY_T5fXqsWguXIO2qfCh0cTlNmPBioSzub5nHp7AU",
        },
      },
    );

    const freshCredentials = response.data.data;
    setCredentials(freshCredentials);
    return freshCredentials;
  };

  const createUpload = (file, auth, canRefresh = true) => {
    const upload = new tus.Upload(file, {
      endpoint: "https://video.bunnycdn.com/tusupload",

      retryDelays: [0, 3000, 5000, 10000, 15000, 30000, 60000],

      chunkSize: 5 * 1024 * 1024,

      metadata: {
        filename: file.name,
        filetype: file.type,
      },

      headers: {
        AuthorizationSignature: auth.authorizationSignature,
        AuthorizationExpire: String(auth.authorizationExpire),
        LibraryId: String(auth.libraryId),
        VideoId: auth.videoId,
      },

      onShouldRetry(error) {
        const status = error.originalResponse?.getStatus();
        if (status === 400 || status === 401 || status === 403) {
          return false;
        }
        return true;
      },

      onProgress(bytesUploaded, bytesTotal) {
        console.log(Math.round((bytesUploaded / bytesTotal) * 100) + "%");
      },

      onSuccess() {
        const poll = async (tries = 0) => {
          if (tries >= 120) {
            setShowError(
              "Upload processing is taking too long. Please check back later.",
            );
            return;
          }

          try {
            const res = await axiosInstance.post(
              `/lecture/complete-video/${auth.videoId}`,
              { courseId: "6ada007c445decc9c2624ad7", order: 1 },
              {
                headers: {
                  Authorization:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZWMzYTNhNzc5Y2MzYTUwNTg3YmI4MSIsInJvbGUiOiJzdHVkZW50Iiwic2Vzc2lvbklkIjoiNmFlYzNhM2E3NzljYzNhNTA1ODdiYjgyIiwiaWF0IjoxNzkzODY2Mjk4LCJleHAiOjE3OTM5NTI2OTh9.3ZSY_T5fXqsWguXIO2qfCh0cTlNmPBioSzub5nHp7AU",
                },
              },
            );

            if (res.status === 202) {
              return setTimeout(() => poll(tries + 1), 10000);
            }
          } catch (err) {
            setShowError(getErrorMessage(err));
          }
        };

        poll();

        setCredentials(false);
      },

      async onError(error) {
        const status = error.originalResponse?.getStatus();
        setCredentials(false);
        setShowError(getErrorMessage(error));

        if (canRefresh && (status === 401 || status === 403)) {
          try {
            const freshCredentials = await refreshCredentials(auth.videoId);
            console.log(freshCredentials);
            const newUpload = createUpload(file, freshCredentials, false);
            const previousUploads = await newUpload.findPreviousUploads();

            if (previousUploads.length) {
              newUpload.resumeFromPreviousUpload(previousUploads[0]);
              newUpload.start();
            } else {
              newUpload.start();
            }
            return;
          } catch (refreshError) {
            setShowError(getErrorMessage(refreshError));
            return;
          }
        }

        await axiosInstance
          .get("/lecture/active-check", {
            headers: {
              Authorization:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZWMzYTNhNzc5Y2MzYTUwNTg3YmI4MSIsInJvbGUiOiJzdHVkZW50Iiwic2Vzc2lvbklkIjoiNmFlYzNhM2E3NzljYzNhNTA1ODdiYjgyIiwiaWF0IjoxNzkzODY2Mjk4LCJleHAiOjE3OTM5NTI2OTh9.3ZSY_T5fXqsWguXIO2qfCh0cTlNmPBioSzub5nHp7AU",
            },
          })
          .catch((e) => setShowError(getErrorMessage(e)));
      },
    });

    return upload;
  };

  const handleChange = async (e) => {
    if (!credentials) {
      return setShowError(
        "Video credentials not set. Please create a video first.",
      );
    }

    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      return setShowError("Please select a valid video file");
    }

    if (!credentials.videoId) {
      setShowError(
        "Video ID not found in credentials. Please create a video first.",
      );
      return;
    }

    const upload = createUpload(file, credentials);

    upload.start();
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/lecture/active-check", {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZWMzYTNhNzc5Y2MzYTUwNTg3YmI4MSIsInJvbGUiOiJzdHVkZW50Iiwic2Vzc2lvbklkIjoiNmFlYzNhM2E3NzljYzNhNTA1ODdiYjgyIiwiaWF0IjoxNzkzODY2Mjk4LCJleHAiOjE3OTM5NTI2OTh9.3ZSY_T5fXqsWguXIO2qfCh0cTlNmPBioSzub5nHp7AU",
          },
        });
        console.log(response);
      } catch (error) {
        setShowError(getErrorMessage(error));
      }
    })();
  }, []);

  return (
    <main className="video-page">
      <div className="video-form">
        <input
          type="text"
          placeholder="Enter Video Title"
          aria-label="Video URL"
          className="video-input"
          ref={inpRef}
        />
        <button
          disabled={check || !!credentials}
          type="button"
          className="video-button"
          onClick={handleClick}
        >
          {check ? "Loading..." : "Create Video"}
        </button>
      </div>
      {credentials && (
        <input type="file" accept="video/*" onChange={handleChange} />
      )}

      {showError && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠</span>
            <p>
              {typeof showError === "string"
                ? showError
                : "Something went wrong"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowError(false)}
            className="text-lg font-semibold hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
