import { createBrowserRouter } from "react-router-dom";

import MainPage from './pages/main-page/MainPage'


const Routers = createBrowserRouter([
    {
        path: "/",
        element: <MainPage/>
    },
    {
        path: "/:username/post/:postSlug",
        element: <>123</>
    }
])

export default Routers