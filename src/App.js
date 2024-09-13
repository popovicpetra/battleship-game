import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import { useEffect } from 'react';
import GamePage from './pages/GamePage/GamePage';
import LoginSignupPage from './pages/LoginSignupPage/LoginSignupPage';
import ProtectedRoutes from './utils/ProtectedRoutes';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route index element={<LoginSignupPage></LoginSignupPage>}></Route>

        <Route element={<ProtectedRoutes></ProtectedRoutes>}>
          <Route path="/game" element={<GamePage></GamePage>}></Route>
        </Route>
      </>
    )
  );

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
