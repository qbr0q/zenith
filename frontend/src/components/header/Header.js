import Logo from './Logo'
import SearchBar from './SearchBar'
import Account from './Account'


const Header = () => {
    return <div className='flex mb-[30px] pt-[40px] grid grid-cols-3'>
        <Logo/>
        <SearchBar/>
        <Account/>
    </div>
}

export default Header