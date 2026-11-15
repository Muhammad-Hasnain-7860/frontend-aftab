import { createBrowserRouter } from "react-router";
import App from "../../App.jsx";
// import Send from "../../Send.jsx";
// import Audio from "../../Audio.jsx";
import ChatMessages from "../../ChatMessage.jsx";
import Dashboard from "../../features/dashboardAdmin/ui/Dashboard.jsx";
import Courses from "../../features/courses/ui/Courses.jsx";
import Auth from "../../features/auth/ui/Auth.jsx";
import AuthCallback from "../../features/auth/ui/AuthCallback.jsx";
import CreateCourse from "../../features/courses/ui/CreateCourse.jsx";
import LectureUpload from "../../features/lecture/ui/LectureUpload.jsx";
import AllLecture from "../../features/dashboardAdmin/ui/AllLecture.jsx";
import DashboardLayout from "../layout/DashboardLayout.jsx";
import AllLectureSession from "../../features/dashboardAdmin/ui/Session.jsx";
import SessionChat from "../../features/dashboardAdmin/ui/SessionChat.jsx";
import StudentChat from "../../features/dashboardAdmin/ui/StudentChat.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
  path: "/admin/dashboard/:courseId",
  element: <DashboardLayout />,
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
      path: "sessions/:sessionId",
      element: <SessionChat />,
    },
    {
      path : 'sessionsStudent/:sessionId',
      element : <StudentChat />
    },
  ],
},
  {
    path: "/admin/courses",
    element: <Courses />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
  },
  {
    path: "/admin/courses/create",
    element: <CreateCourse />,
  },
  {
    path: "/admin/lectureupload/:courseId",
    element: <LectureUpload />,
  },
]);
