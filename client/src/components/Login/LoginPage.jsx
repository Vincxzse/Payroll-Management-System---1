
const emailIcon = "/images/email.png"
const passwordIcon = "/images/password.png"
const googleIcon = "/images/google.png"

export default function LoginPage() {
    return(
        <>
            <div className="h-full w-full flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-start w-1/3 h-4/5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.2)] rounded-lg py-5 px-10 gap-4">
                    <div className="flex flex-col items-center justify-center w-full h-auto">
                        <div className="bg-gray-300 h-12 w-12 rounded-lg"></div>
                        <h1 className="font-medium text-lg">Welcome to Company</h1>
                        <p className="text-[rgba(0,0,0,0.5)]">Sign in to access your workspace</p>
                    </div>
                    <form className="flex flex-col items-start justify-center w-full gap-2">
                        <div className="flex flex-col items-start justify-center">
                            <h2 className="font-medium text-lg">Sign In</h2>
                            <p className="text-[rgba(0,0,0,0.5)]">Enter your credentials to continue</p>
                        </div>
                        <div className="flex flex-col items-start justify-center w-full">
                            <p className="font-medium">Email</p>
                            <div className="flex flex-row items-center justify-start border border-[rgba(0,0,0,0.5)] w-full px-2 py-1 gap-2 rounded-lg">
                                <img src={emailIcon} alt="email icon" className="h-4 w-auto invert-50" />
                                <input type="email" className="outline-none w-full" placeholder="Enter your email" />
                            </div>
                        </div>
                        <div className="flex flex-col items-start justify-center w-full">
                            <p className="font-medium">Password</p>
                            <div className="flex flex-row items-center justify-start border border-[rgba(0,0,0,0.5)] w-full px-2 py-1 gap-2 rounded-lg">
                                <img src={passwordIcon} alt="email icon" className="h-4 w-auto invert-50" />
                                <input type="password" className="outline-none w-full" placeholder="Enter your password" />
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-between w-full">
                            <div className="flex flex-row gap-1">
                                <input type="checkbox" className="cursor-pointer" />
                                <p className="cursor-default">Remember me</p>
                            </div>
                            <a href="" className="text-sm font-medium">Forgot Password?</a>
                        </div>
                        <input type="submit" value="Sign In" className="w-full h-8 bg-black text-white rounded-lg cursor-pointer hover:invert-10 transition duration-200" />
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