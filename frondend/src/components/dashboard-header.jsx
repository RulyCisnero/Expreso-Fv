import { Bell, Search, Settings } from "lucide-react"
//import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center px-4 border-b bg-white">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-blue-600">ExpresoDash</span>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar encomiendas..."
            className="w-[200px] pl-8 md:w-[260px] lg:w-[320px]"
          />
         
        
        </div>
      </div>
    </header>
  )
}
