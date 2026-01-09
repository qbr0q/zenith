import { RouterProvider } from "react-router-dom";
import Routers from './Routers'
import { ModalProvider } from './hooks/modalProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});


const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ModalProvider>
                <RouterProvider router={Routers}/>
            </ModalProvider>
        </QueryClientProvider>
    );
};


export default App