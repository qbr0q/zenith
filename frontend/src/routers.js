import { createBrowserRouter } from "react-router-dom";

import { MainPage } from './pages/main-page/MainPage'
import PostPage from './pages/post-page/PostPage'
import { SearchResultsPage } from './pages/search-page'


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
    }
])

export default Routers