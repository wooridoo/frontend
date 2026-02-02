import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { MainLayout } from '@/components/layout';

const router = createBrowserRouter([
  // Auth Routes (Public)
  {
    path: '/signup',
    element: <div>회원가입 페이지 (TODO)</div>,
  },

  // Main Layout Routes (Protected)
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'discover',
        element: <div>탐색 페이지 (TODO)</div>,
      },
      {
        path: 'groups/:id',
        element: <div>모임 상세 페이지 (TODO)</div>,
      },
      {
        path: 'groups/create',
        element: <div>모임 생성 페이지 (TODO)</div>,
      },
      {
        path: 'my-groups',
        element: <div>내 모임 페이지 (TODO)</div>,
      },
      {
        path: 'mypage',
        element: <div>마이페이지 (TODO)</div>,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
