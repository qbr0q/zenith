import { createBrowserRouter } from "react-router-dom";

import MainPage from './pages/MainPage'

const Routers = createBrowserRouter([
    {
      path: "/",
      element: <MainPage/>
    },
])

export default Routers