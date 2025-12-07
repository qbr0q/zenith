import Logo from '../components/Logo'
import Post from '../components/PostComponent/Post'
import Account from '../components/Account'


const MainPage = () => {
    return <>
        <Logo/>
        <div className="grid grid-cols-3">
            {/* <div className="col-start-1">
                
            </div> */}
            <div className="col-start-2">
                <Post/> 
            </div>
            <div className="col-start-3 justify-self-center w-[60%]">
                <Account/>
            </div>
        </div>
    </>
}

export default MainPage