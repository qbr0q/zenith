import { createBrowserRouter } from "react-router-dom";

import MainPage from './pages/main-page/MainPage'
import PostPage from './pages/post-page/PostPage'


const Routers = createBrowserRouter([
    {
        path: "/",
        element: <MainPage/>
    },
    {
        path: "/:username/post/:postSlug",
        element: <PostPage/>
    }
])

export default Routers