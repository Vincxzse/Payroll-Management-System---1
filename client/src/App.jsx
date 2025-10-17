import Sidebar from "./components/Sidebar/Sidebar"
import MainBody from "./components/Main/MainBody"

function App() {
  return (
    <>
      <div className='grid grid-cols-6 w-screen h-screen bg-white'>
        <Sidebar />
        <MainBody />
      </div>
    </>
  )
}

export default App
