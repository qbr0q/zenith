import { RouterProvider } from "react-router-dom";
import Routers from './Routers'
import { ModalProvider } from './hooks/modalProvider'


const App = () => {
    return (
        <ModalProvider>
            <RouterProvider router={Routers}/>
        </ModalProvider>
    );
};


export default App