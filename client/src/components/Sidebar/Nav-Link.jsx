import { Link, useLocation } from "react-router-dom"

export default function NavLink(props) {
    const location = useLocation()
    const isActive = location.pathname === props.link

    return(
        <>
            <Link to={props.link || "#"} className={`w-full h-10 flex flex-row items-center gap-4 px-3 rounded-lg transition duration-200 cursor-pointer ${
                isActive
                    ? 'bg-black'
                    : 'bg-transparent text-black hover:bg-gray-100'
            }`}>
                <img src={props.image} className={`h-5 w-5 ${ isActive ? 'invert-100' : null }`} />
                <p className={`font-medium ${ isActive ? 'text-white' : 'text-black' }`}>{ props.title }</p>
            </Link>
        </>
    )
}