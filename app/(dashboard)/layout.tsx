import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen w-full bg-slate-50 flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-8 lg:px-12">
          <div className="max-w-7xl mx-auto pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}