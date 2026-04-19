import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f7f9fb]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopBar />
        <main className="mt-16 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  )
}