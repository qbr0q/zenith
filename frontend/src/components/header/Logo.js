const Logo = () => {
    const goMainPage = () => {
        if (window.location.href !== "/") {
            window.location.href = "/";
        }
    }

    return (
        <img src='/media/favicon.svg'
        alt='лого' className='h-[65px] ml-[20px] cursor-pointer'
        title='Zenith'
        onClick={goMainPage}/>
    )
}

export default Logo