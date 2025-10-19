import LoginPage from "./components/Login/LoginPage"
import Sidebar from "./components/Sidebar/Sidebar"
import MainBody from "./components/Main/MainBody"

function App() {
  return (
    <>
      {/* <div className='grid grid-cols-6 w-screen h-screen bg-white'> */}
      <div className='flex flex-col w-screen h-screen bg-white'>
        {/* <Sidebar />
        <MainBody /> */}
        <LoginPage />
      </div>
    </>
  )
}

export default App
