import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import BottomBar from './components/BottomBar';
import PredictionChart from './components/Dashboard/PredictionChart';
import SignalBadge from './components/Dashboard/SignalBadge';
import ModelVoting from './components/Dashboard/ModelVoting';
import ForecastTable from './components/Dashboard/ForecastTable';
import RiskCalculator from './components/Dashboard/RiskCalculator';
import TradeHistory from './components/Dashboard/TradeHistory';

function App() {
  return (
    <div className="h-screen w-full bg-background text-text-primary overflow-hidden flex flex-col selection:bg-accent/30 font-sans">
      <TopBar />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto pb-10 relative">
          
          <div className="p-6 max-w-[2000px] mx-auto">
            {/* 12-Column CSS Grid setup */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Left Column (8 cols): Primary charts and wide modules */}
              <div className="xl:col-span-8 flex flex-col gap-6">
                
                {/* Main TV-style prediction map */}
                <div className="h-[550px] w-full">
                  <PredictionChart />
                </div>

                {/* Algorithmic Voting Module */}
                <div className="h-[220px]">
                  <ModelVoting />
                </div>

                {/* Trade History and Cumulative Equity */}
                <div className="min-h-[350px]">
                  <TradeHistory />
                </div>

              </div>

              {/* Right Column (4 cols): Control panels, signals, risk */}
              <div className="xl:col-span-4 flex flex-col gap-6">
                 
                 <div className="shrink-0">
                    <SignalBadge />
                 </div>

                 <div className="h-[360px]">
                    <ForecastTable />
                 </div>

                 <div className="h-[320px]">
                    <RiskCalculator />
                 </div>
                 
              </div>

            </div>
          </div>
        </main>
      </div>

      <BottomBar />
    </div>
  )
}

export default App
