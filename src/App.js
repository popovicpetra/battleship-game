import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'

import GamePage from './pages/GamePage/GamePage'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route index element={<GamePage></GamePage>}></Route>
    )
  )

  return <RouterProvider router={router}></RouterProvider>
}

export default App
