

export default function NavLink(props) {
    return(
        <>
            <button className="w-full h-10 flex flex-row items-center gap-4 px-3 bg-transparent rounded-lg hover:bg-gray-100 transition duration-200 cursor-pointer">
                <img src={props.image} className="h-5 w-5" />
                <p className="font-medium text-black">{ props.title }</p>
            </button>
        </>
    )
}