import { Suspense } from 'react';
import { createBrowserRouter, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";
import AiroErrorBoundary from '../export-plugins/AiroErrorBoundary';
import RootLayout from './layouts/RootLayout';
import Spinner from './components/Spinner';
import { routes } from './routes';
const SpinnerFallback = () => <div className="flex justify-center py-8 h-screen items-center">
    <Spinner />
  </div>;

// Create router with layout wrapper
const router = createBrowserRouter([{
  path: '/',
  element: import.meta.env.MODE === 'development' ? <AiroErrorBoundary>
        <Suspense fallback={<SpinnerFallback />}>
          <RootLayout>
            <Outlet />
          </RootLayout>
        </Suspense>
      </AiroErrorBoundary> : <Suspense fallback={<SpinnerFallback />}>
        <RootLayout>
          <Outlet />
        </RootLayout>
      </Suspense>,
  children: routes
}]);
export default function App() {
  return <>
      <RouterProvider router={router} />
    </>;
}
