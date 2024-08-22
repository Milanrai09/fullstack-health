import * as React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import HomePage from './screen/HomeScreen.tsx';
import ArticleScreen from './screen/ArticleScreen.tsx';
import AboutScreen from './screen/AboutScreen.tsx';
import AiScreen from './screen/AiScreen.tsx';
import PopularSubPage from './subPages/PopularSubPage.tsx';
import MentalHealthSubPage from './subPages/MentalHealthSubPage.tsx';
import DietSubPage from './subPages/DietSubPage.tsx';
import FitnessSubPage from './subPages/FitnessSubPage.tsx';
import HealthyLifestyleSubPage from './subPages/HealthyLifestyleSubPage.tsx';
import LoginScreen from './screen/LoginScreen.tsx';
import RegisterScreen from './screen/RegisterScreen.tsx';
import AccountManageSubPage from './subPages/AccountManageSubPage.tsx';
import CreateArticleSubPage from './subPages/CreateArticleSubPage.tsx';
import YourArticleSubPage from './subPages/YourArticleSubPage.tsx';
import SavedSubPage from './subPages/SavedSubPage.tsx';
import AdminScreen from './screen/AdminScreen.tsx';
import AdminUserSubPage from './subPages/AdminUserSubPage.tsx';
import AdminArticlesSubPage from './subPages/AdminArticlesSubPage.tsx';
import AdminCreateApproveSubPage from './subPages/AdminCreateApproveSubPage.tsx';
import AdminEditApproveSubPage from './subPages/AdminEditApproveSubPage.tsx';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SingleArticleScreen from './subPages/SingleArticleScreen.tsx';
import ArticleAboutSubPage from './subPages/ArticleAboutSubPage.tsx';
import AdminAboutSubPage from './subPages/AdminAboutSubPage.tsx';



const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<HomePage />} />

      <Route path="article" element={<ArticleScreen />}>
        <Route index element={<ArticleAboutSubPage />} />
        <Route path="popular" element={<PopularSubPage/>} />
        <Route path="mental-health" element={<MentalHealthSubPage />} />
        <Route path="diet" element={<DietSubPage />} />
        <Route path="fitness" element={<FitnessSubPage />} />
        <Route path="healthy-lifestyle" element={<HealthyLifestyleSubPage />} />
      </Route>


  <Route path="/article/popular/:id" element={<SingleArticleScreen />} />
  <Route path="/article/healthy-lifestyle/:id" element={<SingleArticleScreen />} />
  <Route path="/article/article/:id" element={<SingleArticleScreen />} />
  <Route path="/article/mental-health/:id" element={<SingleArticleScreen />} />
  <Route path="/article/diet/:id" element={<SingleArticleScreen />} />


      <Route path="ai" element={<AiScreen />} />
      <Route path="about" element={<AboutScreen />} />

      <Route path="login" element={<LoginScreen />} />
      <Route path="register" element={<RegisterScreen />}  />
      <Route path="account-management" element={<AccountManageSubPage />} />
      <Route path="create-article" element={<CreateArticleSubPage />} />
      <Route path="your-articles" element={<YourArticleSubPage />} />
      <Route path="saved" element={<SavedSubPage />} />
      <Route path="admin" element={<AdminScreen />}>
        <Route index element={<AdminAboutSubPage />} />
        <Route path="adminUser" element={<AdminUserSubPage />} />
        <Route path="adminArticle" element={<AdminArticlesSubPage />} />
        <Route path="adminCreateApprove" element={<AdminCreateApproveSubPage />} />
        <Route path="adminEditApprove" element={<AdminEditApproveSubPage />} />
      </Route>
    </Route>
  )
);


const darkMode = localStorage.getItem('darkMode') === 'true';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId='488260919710-f28ol2i3cq306o7d1oapcec8kfuk4dr8.apps.googleusercontent.com'>
      <React.StrictMode>
        <div className={darkMode ? 'dark-mode' : ''}>
          <RouterProvider router={router} />
        </div>
      </React.StrictMode>
    </GoogleOAuthProvider>
  </QueryClientProvider>
);



