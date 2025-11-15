
const notificationIcon = "/images/notification.png"
const searchIcon = "/images/search.png"
const dropdownIcon = "/images/dropdown.png"

export default function Header({ pageLayout, pageTitle, pageDescription, currentUser }) {
    const firstLetter = currentUser.first_name[0].toUpperCase()
    const secondLetter = currentUser.last_name[0].toUpperCase()

    return(
        <>
            <div className="flex flex-row items-center justify-between h-1/10 w-full border-b border-[rgba(0,0,0,0.2)] px-5">
                <div className="flex flex-col items-start justify-center">
                    <h2 className="text-sans font-medium text-md">{ pageTitle }</h2>
                    <p className="text-sm text-[rgba(0,0,0,0.5)]">{ pageDescription }</p>
                </div>
                <div className="flex flex-row items-center justify-end h-full w-auto gap-2">
                    <button className="flex flex-row h-10 w-auto items-center justify-start gap-1 cursor-pointer hover:bg-gray-100 transition duration-200 px-2 rounded-lg">
                        <img src={searchIcon} alt="bell icon" className="h-5 w-auto" />
                    </button>
                    <button className="flex flex-row h-10 w-auto items-center justify-start gap-1 cursor-pointer hover:bg-gray-100 transition duration-200 px-2 rounded-lg">
                        <img src={notificationIcon} alt="bell icon" className="h-5 w-auto" />
                    </button>
                    <button className={`${pageLayout ? 'hidden xl:flex' : 'hidden'} flex-row h-10 w-auto items-center justify-start gap-3 cursor-pointer hover:bg-gray-100 transition duration-200 px-2 rounded-lg`}>
                        <div className={`${currentUser.profile_picture_url === null ? 'bg-gradient-to-tl from-blue-500 to-purple-500' : 'bg-gray-300'} h-6 w-6 rounded-full flex flex-row items-center justify-center`}>
                            <p className="text-xs font-medium text-white">{firstLetter+secondLetter}</p>
                        </div>
                        <h2 className="text-sans font-normal text-sm">{currentUser.first_name} {currentUser.last_name}</h2>
                        <img src={dropdownIcon} alt="drop down icon" className="h-4 w-auto" />
                    </button>
                </div>
            </div>
        </>
    )
}