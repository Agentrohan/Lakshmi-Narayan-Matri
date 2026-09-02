import { RouteObject } from "react-router";
import { lazy } from 'react';
import HomePage from './pages/index';
import AboutPage from './pages/about';
import HowItWorksPage from './pages/how-it-works';
import ContactPage from './pages/contact';
import RegisterPage from './pages/register';
import AdminLoginPage from './pages/admin';
import AdminDashboardPage from './pages/admin/dashboard';
const NotFoundPage = import.meta.env.DEV ? lazy(() => import('../export-plugins/PageNotFound')) : lazy(() => import('./pages/_404'));
export const routes: RouteObject[] = [{
  path: '/',
  element: <HomePage />
}, {
  path: '/about',
  element: <AboutPage />
}, {
  path: '/how-it-works',
  element: <HowItWorksPage />
}, {
  path: '/contact',
  element: <ContactPage />
}, {
  path: '/register',
  element: <RegisterPage />
}, {
  path: '/admin',
  element: <AdminLoginPage />
}, {
  path: '/admin/dashboard',
  element: <AdminDashboardPage />
}, {
  path: '*',
  element: <NotFoundPage />
}];
export type Path = '/' | '/about' | '/how-it-works' | '/contact' | '/register' | '/admin' | '/admin/dashboard';
export type Params = Record<string, string | undefined>;
