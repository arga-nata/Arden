import { SectionCards } from "@/components/dashboard/home/section-cards"
import { OverviewChart } from "@/components/dashboard/home/overview-chart"
import { DashboardBanner } from "@/components/dashboard/home/dashboard-banner"
import { ActivityLog } from "@/components/dashboard/home/activity-log"
import { BottomGrids } from "@/components/dashboard/home/bottom-grids"
import { statsData, chartData, activityLogs } from "@/lib/dummy-data"

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      {/* items-stretch memaksa kolom kiri (3/4) dan kanan (1/4) memiliki tinggi yang sama persis */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 items-stretch">
        
        {/* KOLOM KIRI */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          <DashboardBanner />
          <SectionCards stats={statsData} />
          <div className="grid grid-cols-1">
             <OverviewChart data={chartData} />
          </div>
          <BottomGrids />
        </div>

        {/* KOLOM KANAN - h-full agar ActivityLog mengisi sisa ruang secara vertikal */}
        <div className="lg:col-span-1 h-full flex flex-col">
           <ActivityLog logs={activityLogs} />
        </div>

      </div>
    </div>
  )
}