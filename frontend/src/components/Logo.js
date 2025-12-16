const Logo = () => {
    const goMainPage = () => {
        window.location.href = "/";
    }

    return (
        <img src='/media/favicon.svg'
        alt='лого' className='h-[50px] mt-[1%] ml-[1%] cursor-pointer'
        title='Zenith'
        onClick={goMainPage}/>
    )
}

export default Logo