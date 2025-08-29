import ProjectFeed from "@/components/home/feed/ProjectFeed";
import YourProjects from "@/components/home/feed/YourProjects";
import NotificationsPanel from "@/components/home/NotificationsPanel";

const HomePage = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex h-screen">
                {/* Left: Your Projects (Fixed) */}
                <aside className="hidden lg:block w-80 bg-white border-r border-slate-200">
                    <div className="p-6">
                        <YourProjects/>
                    </div>
                </aside>

                {/* Center: Feed (Scrollable) */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto p-6">
                        <ProjectFeed />
                    </div>
                </main>

                {/* Right: Notifications (Fixed) */}
                <aside className="hidden xl:block w-80 bg-white border-l border-slate-200">
                    <div className="p-6">
                        <NotificationsPanel/>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default HomePage;