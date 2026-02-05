import Header from '../../components/header/Header'
import MainPost from './MainPost'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'


const MainPage = () => {
    return <>
        <Header/>
        <div className="grid grid-cols-3">
            <div className="col-start-1 justify-self-center w-[60%]">
                <LeftSidebar/>
            </div>
            <div className="col-start-2 rounded-xl">
                <MainPost/>
            </div>
            <div className="col-start-3 justify-self-center w-[60%]">
                <RightSidebar/>
            </div>
        </div>
    </>
}

export default MainPage