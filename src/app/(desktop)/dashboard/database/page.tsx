import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiswiDataTable } from "@/components/dashboard/database/siswi-table"
import { ClassDataTable } from "@/components/dashboard/database/class-table"
import { UsersDataTable } from "@/components/dashboard/database/users-table"
import { Users, School, GraduationCap } from "lucide-react"

async function fetchData(endpoint: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/${endpoint}`, { cache: "no-store" })
    if (!res.ok) return null
    const json = await res.json()
    return json.status === "success" ? json.data : null
  } catch {
    return null
  }
}

export default async function DatabasePage() {

  const [siswiData, classData, userData] = await Promise.all([
    fetchData("siswi"),
    fetchData("class"),
    fetchData("user"),
  ])

  // Definisi Tabs
  const tabs = [
    { value: "students", label: "Students", icon: GraduationCap },
    { value: "classes", label: "Classes", icon: School },
    { value: "users", label: "Users", icon: Users },
  ]

  return (
    <div className=" space-y-6 p-4 pb-12 text-white sm:p-6">
      <Tabs defaultValue="students" className="w-full">
        {/* ===== HEADER & ACTION BUTTONS ===== */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Master Database
            </h1>
            <p className="text-sm text-gray-500">
              Manajemen Data Siswi, Kelas, dan Akun Sistem.
            </p>
          </div>

          <TabsList className="bg-transparent border-0 p-0 h-auto flex w-full md:w-auto gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="
                  /* Base Layout & Animation */
                  sidebar-shine relative overflow-hidden group flex items-center gap-2 rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all
                  
                  /* Default State (Inactive) */
                  border border-transparent bg-transparent text-gray-500 
                  
                  /* Hover State */
                  hover:bg-white/5 hover:text-gray-300
                  
                  /* Active State (Clean, No Heavy Glow, Animation Kept) */
                  data-[state=active]:bg-indigo-600 
                  data-[state=active]:text-white 
                  data-[state=active]:border-indigo-500/50
                "
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* ===== CONTENT ===== */}
        <Suspense
          fallback={
            <div className="text-muted-foreground flex h-40 items-center justify-center text-sm">
              Loading data...
            </div>
          }
        >
          <TabsContent value="students" className="pt-4 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="no-scrollbar overflow-x-auto pb-3">
              <SiswiDataTable data={siswiData || []} />
            </div>
          </TabsContent>

          <TabsContent value="classes" className="pt-4 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="no-scrollbar overflow-x-auto pb-3">
              <ClassDataTable data={classData || []} />
            </div>
          </TabsContent>

          <TabsContent value="users" className="pt-4 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="no-scrollbar overflow-x-auto pb-3">
              <UsersDataTable data={userData?.data || userData || []} />
            </div>
          </TabsContent>
        </Suspense>
      </Tabs>
    </div>
  )
}