import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import Modal from "react-modal";
import reportWebVitals from "./reportWebVitals";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import LoginScreen from "./screens/LoginScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ForgotUsernameScreen from "./screens/ForgotUsernameScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import MemberScreen from "./screens/MemberScreen";
import AboutScreen from "./screens/AboutScreen";
import HomeScreen from "./screens/HomeScreen";
import UserListScreen from "./screens/Admin/UserListScreen";
import MockUserListScreen from "./screens/Admin/MockUserListScreen";
import UserEditScreen from "./screens/Admin/UserEditScreen";

import EventListScreen from "./screens/Admin/EventListScreen";
import MockEventListScreen from "./screens/Admin/MockEventListScreen";
import MockEventEditScreen from "./screens/Admin/MockEventEditScreen";
import EventCreateScreen from "./screens/Admin/EventCreateScreen";
import EventEditScreen from "./screens/Admin/EventEditScreen";

import NewsScreen from "./screens/NewsScreen";
import MockNewsScreen from "./screens/MockNewsScreen";
import NewsCreateScreen from "./screens/Admin/NewsCreateScreen";
import NewsListScreen from "./screens/Admin/NewsListScreen";
import MockNewsListScreen from "./screens/Admin/MockNewsListScreen";
import NewsEditScreen from "./screens/Admin/NewsEditScreen";

import PendingApprovalScreen from "./screens/PendingApprovalScreen";

import ImageUploadScreen from "./screens/Admin/ImageUploadScreen";
import ImageListScreen from "./screens/Admin/ImageListScreen";
import MockImageListScreen from "./screens/Admin/MockImageListScreen";
import ImageEditScreen from "./screens/Admin/ImageEditScreen";

import GalleryScreen from "./screens/GalleryScreen";
import MockGalleryScreen from "./screens/MockGalleryScreen";
import GalleryByTagScreen from "./screens/GalleryByTagScreen";

import MemberListScreen from "./screens/Admin/MemberListScreen";
import MockMemberListScreen from "./screens/Admin/MockMemberListScreen";
import MemberCreateScreen from "./screens/Admin/MemberCreateScreen";
import MemberEditScreen from "./screens/Admin/MemberEditScreen";
import MockMemberDirectory from "./screens/MockMemberDirectory";

import BulletinBoard from "./screens/BB/BulletinBoard";
import MockBulletinBoard from "./screens/BB/MockBulletinBoard";
import CreatePost from "./screens/BB/CreatePost";
import MockCreatePost from "./screens/BB/MockCreatePost";
import MyPosts from "./screens/BB/MyPosts";
import BBListScreen from "./screens/Admin/BBListScreen";
import MockBBListScreen from "./screens/Admin/MockBBListScreen";
import BBEditScreen from "./screens/Admin/BBEditScreen";

import EventCalendar from "./screens/EventCalendar";
import MockEventCalendar from "./screens/MockEventCalendar";
import BBUserEditScreen from "./screens/BB/BBUserEditScreen.jsx";

import HouseRulesScreen from "./screens/HouseRulesScreen.jsx";
import BylawsScreen from "./screens/BylawsScreen.jsx";
import HistoryScreen from "./screens/HistoryScreen.jsx";
import NotFoundPage from "./components/NotFoundPage";

Modal.setAppElement("#root");

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="register" element={<RegistrationScreen />} />
      <Route path="login" element={<LoginScreen />} />
      <Route path="login/success" element={<LoginScreen />} />
      <Route path="pending-approval" element={<PendingApprovalScreen />} />
      <Route path="forgot-username" element={<ForgotUsernameScreen />} />
      <Route path="forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="reset-password/:token" element={<ResetPasswordScreen />} />

      {/* Private Routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="news" element={<MockNewsScreen />} />
        <Route path="home" element={<MemberScreen />} />
        <Route path="about" element={<AboutScreen />} />
        <Route path="gallery" element={<MockGalleryScreen />} />
        <Route path="gallery/:tag" element={<GalleryByTagScreen />} />
        <Route path="directory" element={<MockMemberDirectory />} />
        <Route path="bb" element={<MockBulletinBoard />} />
        <Route path="bb/create" element={<MockCreatePost />} />
        <Route path="bb/edit/:id" element={<BBUserEditScreen />} />
        <Route path="bb/mine" element={<MyPosts />} />
        <Route path="calendar" element={<MockEventCalendar />} />
        <Route path="house-rules" element={<HouseRulesScreen />} />
        <Route path="bylaws" element={<BylawsScreen />} />
        <Route path="history" element={<HistoryScreen />} />
      </Route>

      {/* Admin Routes */}
      <Route path="admin" element={<AdminRoute />}>
        <Route path="user/list" element={<MockUserListScreen />} />
        <Route path="user/:id/edit" element={<UserEditScreen />} />
        <Route path="news/list" element={<MockNewsListScreen />} />
        <Route path="news/create" element={<NewsCreateScreen />} />
        <Route path="news/:id/edit" element={<NewsEditScreen />} />
        <Route path="images/upload" element={<ImageUploadScreen />} />
        <Route path="images/list" element={<MockImageListScreen />} />
        <Route path="images/:id/edit" element={<ImageEditScreen />} />
        <Route path="members/list" element={<MockMemberListScreen />} />
        <Route path="members/create" element={<MemberCreateScreen />} />
        <Route path="members/:id/edit" element={<MemberEditScreen />} />
        <Route path="bb" element={<MockBBListScreen />} />
        <Route path="bb/:id/edit" element={<BBEditScreen />} />
        <Route path="events/list" element={<MockEventListScreen />} />
        <Route path="events/create" element={<MockEventEditScreen />} />
        <Route path="events/:id/edit" element={<MockEventEditScreen />} />
      </Route>
      {/* 404 catch-all route */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
