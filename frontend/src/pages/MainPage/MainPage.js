import Logo from '../../components/Logo'
import MainPost from './MainPost'
import Account from '../../components/Account'


const MainPage = () => {
    return <div>
        <Logo/>
        <div className="grid grid-cols-3">
            {/* <div className="col-start-1">
                
            </div> */}
            <div className="col-start-2 rounded-xl">
                <MainPost/>
            </div>
            <div className="col-start-3 justify-self-center w-[60%]">
                <Account/>
            </div>
        </div>
    </div>
}

export default MainPage