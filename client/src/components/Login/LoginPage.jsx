
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../../config"

const emailIcon = "/images/email.png"
const passwordIcon = "/images/password.png"
const googleIcon = "/images/google.png"
const companyLogo = "images/logo.jpg"
const hiddenIcon = "/images/hide-password.png"
const visibleIcon = "/images/show-password.png"

export default function LoginPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!email || !password) return setErrorMessage("Please fill in all fields")
        try {
            const body = { email, password }
            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            const data = await response.json()
            if (!response.ok) {
                setErrorMessage(data.message)
            } else {
                localStorage.setItem("user", JSON.stringify(data.user))
                navigate("/admin")
                setErrorMessage(data.message)
            }
        } catch (err) {
            console.error(err.message)
            alert("Internal server error")
        }
    }
    
    return(
        <>
            <div className="h-full w-full flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-between w-1/3 h-7/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.2)] rounded-lg py-5 px-10 gap-4">
                    <div className="flex flex-col items-center justify-center w-full h-auto">
                        <img src={companyLogo} className="bg-gray-300 h-12 w-12 rounded-lg" />
                        <h1 className="font-medium text-lg">Welcome to D.Vella Clothing</h1>
                        <p className="text-[rgba(0,0,0,0.5)]">Sign in to access your workspace</p>
                    </div>
                    <form
                        onSubmit={handleLogin}
                        className="flex flex-col items-center justify-center w-full gap-2"
                    >
                        <div className="flex flex-col items-start justify-center w-full">
                            <p className="font-medium">Email</p>
                            <div className="flex flex-row items-center justify-start border border-[rgba(0,0,0,0.5)] w-full px-2 py-1 gap-2 rounded-lg">
                                <img src={emailIcon} alt="email icon" className="h-4 w-auto invert-50" />
                                <input
                                    type="email"
                                    className="outline-none w-full"
                                    placeholder="Enter your email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col items-start justify-center w-full">
                            <p className="font-medium">Password</p>
                            <div className="flex flex-row items-center justify-start border border-[rgba(0,0,0,0.5)] w-full px-2 py-1 gap-2 rounded-lg">
                                <img src={passwordIcon} alt="email icon" className="h-4 w-auto invert-50" />
                                <div className="flex flex-row w-full">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="outline-none w-full"
                                        placeholder="Enter your password"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-500 hover:text-black text-sm cursor-pointer"
                                    >
                                        <img src={showPassword ? visibleIcon : hiddenIcon} className="h-4 w-auto" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-between w-full">
                            <div className="flex flex-row gap-1">
                                <input type="checkbox" className="cursor-pointer" />
                                <p className="cursor-default">Remember me</p>
                            </div>
                            <a href="" className="text-sm font-medium">Forgot Password?</a>
                        </div>
                        <div className="flex flex-col h-auto w-full">
                            <input type="submit" value="Sign In" className="w-full h-8 bg-black text-white rounded-lg cursor-pointer hover:invert-10 transition duration-200" />
                            <p className="text-red-500">{errorMessage}</p>
                        </div>
                    </form>
                    <p className="text-xs text-[rgba(0,0,0,0.5)]">Or continue with</p>
                    <button className="w-full h-8 bg-white flex flex-row items-center justify-center gap-2 border rounded-lg border-[rgba(0,0,0,0.5)] cursor-pointer hover:invert-100 transition duration-200">
                        <img src={googleIcon} alt="google icon" className="h-4 w-auto" />
                        Google
                    </button>
                    <div className="flex flex-row items-center justify-center gap-1">
                        <p className="text-sm">Don't have an account?</p>
                        <a href="" className="text-sm hover:border-b">Contact your administrator</a>
                    </div>
                </div>
            </div>
        </>
    )
}