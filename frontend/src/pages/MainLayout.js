import Header from "../components/header/Header";
import LeftSidebar from "./main-page/LeftSidebar";
import RightSidebar from "./main-page/RightSidebar"

const MainLayout = ({ children }) => {
    return (
        <>
            <Header />
            <div className="grid grid-cols-3">
                <div className="col-start-1 justify-self-center w-[60%]">
                    <LeftSidebar />
                </div>

                <div className="col-start-2 bg-white border rounded-xl">
                    {children}
                </div>

                <div className="col-start-3 justify-self-center w-[60%]">
                    <RightSidebar />
                </div>
            </div>
        </>
    );
};

export default MainLayout;