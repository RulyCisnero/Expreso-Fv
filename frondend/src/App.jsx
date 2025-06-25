import './App.css';
import { DashboardHeader } from './components/dashboard-header';
import EncomiendaTable from "@/components/EncomiendaTable";

function App() {
  return (
    <>
      <DashboardHeader />
      <main className="p-4">
        <EncomiendaTable />
      </main>
    </>
  )
}

export default App
