import { createBrowserRouter } from "react-router";
import App from "../../App.jsx";
import Dashboard from "../../features/dashboardAdmin/ui/Dashboard.jsx";
import Courses from "../../features/courses/ui/Courses.jsx";
import AuthCallback from "../../features/auth/ui/AuthCallback.jsx";
import CreateCourse from "../../features/courses/ui/CreateCourse.jsx";
import LectureUpload from "../../features/lecture/ui/LectureUpload.jsx";
import AllLecture from "../../features/dashboardAdmin/ui/AllLecture.jsx";
import DashboardLayout from "../layout/DashboardLayout.jsx";
import AllLectureSession from "../../features/dashboardAdmin/ui/Session.jsx";
import SessionChat from "../../features/dashboardAdmin/ui/SessionChat.jsx";
import StudentChat from "../../features/dashboardAdmin/ui/StudentChat.jsx";
import Students from "../../features/dashboardAdmin/ui/Students.jsx";
import Marks from "../../features/dashboardAdmin/ui/Marks.jsx";
import {
  AuthBootstrap,
  RedirectAuthenticatedUser,
  RequireAdmin,
} from "./AuthGuards.jsx";

export const router = createBrowserRouter([
  {
    element: <AuthBootstrap />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/admin/dashboard/:courseId",
        element: (
          <RequireAdmin>
            <DashboardLayout />
          </RequireAdmin>
        ),
        children: [
          {
            path: "lectures",
            element: <AllLecture />,
          },
          {
            path: "",
            element: <Dashboard />,
          },
          {
            path: "sessions",
            element: <AllLectureSession />,
          },
          {
            path: "students",
            element: <Students />,
          },
          {
            path: "marks",
            element: <Marks />,
          },
          {
            path: "sessions/:sessionId",
            element: <SessionChat />,
          },
        ],
      },
      {
        path: "/admin/courses",
        element: (
          <RequireAdmin>
            <Courses />
          </RequireAdmin>
        ),
      },
      {
        path: "/admin/courses/create",
        element: (
          <RequireAdmin>
            <CreateCourse />
          </RequireAdmin>
        ),
      },
      {
        path: "/admin/lectureupload/:courseId",
        element: (
          <RequireAdmin>
            <LectureUpload />
          </RequireAdmin>
        ),
      },
      {
        path: "/auth",
        element: <RedirectAuthenticatedUser />,
      },
      {
        path: "/auth/callback",
        element: <AuthCallback />,
      },
      {
        path: "/admin/dashboard/:courseId/sessionsStudent/:sessionId",
        element: <StudentChat />,
      },
    ],
  },
]);
