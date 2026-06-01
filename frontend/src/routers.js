import { createBrowserRouter } from "react-router-dom";

import { MainPage } from './pages/main-page/MainPage'
import PostPage from './pages/post-page/PostPage'
import { SearchResultsPage } from './pages/search-page'
import { DashBoard } from './pages/dashboard-page'


const Routers = createBrowserRouter([
    {
        path: "/",
        element: <MainPage/>
    },
    {
        path: "/:username/post/:postSlug",
        element: <PostPage/>
    },
    {
        path: "/search",
        element: <SearchResultsPage/>
    },
    {
        path: "/dashboard",
        element: <DashBoard/>
    }
])

export default Routers