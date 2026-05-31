import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  Train, Clock, Navigation, MapPin, AlertCircle, 
  ChevronRight, Heart, Share2, History, Compass, BrainCircuit, ShieldCheck, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TimelineItem = ({ station, isLast, isCurrent, isPassed }) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className={`relative pl-10 pb-10 last:pb-0 group ${isPassed ? 'opacity-40' : 'opacity-100'}`}
  >
    {!isLast && (
      <div className={`absolute left-[11px] top-6 w-[2px] h-full ${isPassed ? 'bg-primary' : 'bg-slate-800'}`}></div>
    )}
    <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 transition-all duration-500 ${
      isCurrent ? 'bg-primary border-white scale-125 z-10 shadow-[0_0_15px_#7c3aed]' : 
      isPassed ? 'bg-slate-800 border-slate-700' : 'bg-slate-900 border-slate-800 group-hover:border-primary/50'
    }`}>
      {isCurrent && <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-25"></div>}
    </div>
    
    <div className={cn(
      "glass p-5 rounded-2xl border border-white/5 transition-all group-hover:border-white/10",
      isCurrent && "bg-white/5 border-primary/30"
    )}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h4 className={`font-black tracking-tight ${isCurrent ? 'text-primary' : 'text-white'}`}>
            {station.stationName} <span className="text-slate-600 font-bold text-[10px] ml-2">({station.stationCode})</span>
          </h4>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-[10px] font-black text-slate-500 flex items-center gap-1.5 uppercase tracking-widest">
              <Clock className="w-3 h-3 text-primary" /> {station.scheduledArrivalTime}
            </p>
            <p className="text-[10px] font-black text-slate-500 flex items-center gap-1.5 uppercase tracking-widest">
              <Navigation className="w-3 h-3 text-accent" /> {station.distanceFromSource} km
            </p>
          </div>
        </div>
        {isCurrent && (
          <span className="bg-primary/20 text-primary border border-primary/20 text-[8px] font-black uppercase px-3 py-1 rounded-full w-fit tracking-[0.2em] animate-pulse">
            Live Location
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

export const TrainDetails = () => {
  const { id } = useParams();
  const [train, setTrain] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainRes, statusRes, favRes] = await Promise.all([
          api.get(`/trains/${id}`),
          api.get(`/trains/${id}/status`),
          api.get('/favorites')
        ]);
        setTrain(trainRes.data);
        setStatus(statusRes.data);
        setIsFavorite(favRes.data.includes(id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-40 gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse"></div>
        </div>
        <p className="text-slate-400 font-black tracking-[0.3em] uppercase text-xs">Establishing Satellite Link...</p>
      </div>
    </Layout>
  );

  if (!train) return (
    <Layout>
      <div className="text-center py-40 glass rounded-[3rem] border border-dashed border-white/10 max-w-2xl mx-auto">
        <AlertCircle className="w-16 h-16 text-red-500/50 mx-auto mb-6" />
        <h2 className="text-3xl font-black text-white mb-4">Signal Lost</h2>
        <p className="text-slate-400 mb-8">Could not locate the requested train.</p>
        <Link to="/dashboard" className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/30">
          Back to Dashboard
        </Link>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="space-y-10 pb-20">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-slate-900 border border-white/10 p-5 rounded-3xl shadow-2xl relative group"
            >
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Train className="w-10 h-10 text-primary relative z-10" />
            </motion.div>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{train.trainName}</h1>
                <span className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{train.type}</span>
              </div>
              <p className="text-slate-500 font-bold text-lg mt-1 flex items-center gap-2">
                <span className="text-white/40">#{train.trainNumber}</span>
                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                {train.source} → {train.destination}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                if(isFavorite) await api.delete(`/favorites/${id}`);
                else await api.post(`/favorites/${id}`);
                setIsFavorite(!isFavorite);
              }}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border ${
                isFavorite ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' : 'bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} /> {isFavorite ? 'Saved' : 'Save Track'}
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/5 rounded-2xl text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-white hover:bg-white/10 transition-all"
            >
              <Share2 className="w-5 h-5" /> Share
            </motion.button>
          </div>
        </div>

        {/* Live Status and Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Live Status Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden group border border-white/5"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32"></div>
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="flex items-center gap-10">
                    <div className="text-center">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Network Status</p>
                      <div className={`inline-flex px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${status.status === 'On Time' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                        {status.status}
                      </div>
                    </div>
                    <div className="w-[1px] h-20 bg-white/5 hidden md:block"></div>
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">GPS Position</p>
                      <h3 className="text-3xl font-black text-white tracking-tighter">{status.currentStation}</h3>
                      <p className="text-sm font-bold text-slate-500 mt-2 flex items-center gap-2">
                        Next Link: <span className="text-accent">{status.nextStation}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center md:text-right">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Estimated Delay</p>
                    <div className="flex items-center justify-center md:justify-end gap-3">
                       <Clock className="w-6 h-6 text-primary" />
                       <h3 className="text-5xl font-black tracking-tighter text-white">{Math.round(status.delay)}<span className="text-xl text-slate-600 ml-1">min</span></h3>
                    </div>
                    <p className="text-[10px] font-black text-slate-600 mt-3 uppercase tracking-widest">
                       Updated at {new Date(status.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
               </div>
               <Compass className="absolute -left-10 -bottom-10 w-48 h-48 text-white/[0.02] rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
            </motion.div>


            {/* Map Section */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="glass-card rounded-[2.5rem] border border-white/5 p-4 h-[550px] relative overflow-hidden group shadow-2xl"
            >
              <div className="absolute top-8 left-8 z-[1000]">
                <div className="glass px-6 py-4 rounded-3xl flex items-center gap-4 border border-white/10 shadow-2xl backdrop-blur-xl">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                       <MapPin className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white tracking-tight leading-none mb-1">Live Interlink</h4>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Positioning System Active</p>
                    </div>
                </div>
              </div>
              <MapContainer 
                center={[25.3176, 82.9739]} 
                zoom={6} 
                className="w-full h-full rounded-[2rem] z-0"
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {train.routeStations.map((s, idx) => (
                  <Marker key={idx} position={[25.3 + (idx*0.2), 82.9 + (idx*0.5)]}>
                    <Popup>
                      <div className="font-bold text-slate-900">{s.stationName}</div>
                      <div className="text-xs font-medium text-slate-500 text-center">Scheduled: {s.scheduledArrivalTime}</div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </motion.div>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { label: 'Current Speed', value: '84 km/h', icon: Zap, color: 'text-yellow-400' },
                 { label: 'Network Power', value: 'Electric OHE', icon: ShieldCheck, color: 'text-emerald-400' },
                 { label: 'Distance left', value: '412 km', icon: Navigation, color: 'text-cyan-400' }
               ].map((stat, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.5 + (i * 0.1) }}
                   className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-5"
                 >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                       <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                       <p className="text-xl font-black text-white">{stat.value}</p>
                    </div>
                 </motion.div>
               ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* AI Prediction Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group shadow-2xl"
            >
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 blur-[80px] group-hover:bg-accent/10 transition-all"></div>
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="bg-accent/10 p-3 rounded-2xl border border-accent/20">
                      <BrainCircuit className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white tracking-tighter">AI Forecaster</h3>
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-0.5">Predictive Analysis</p>
                    </div>
                 </div>
                 
                 <div className="space-y-8">
                    <div>
                      <div className="flex justify-between items-end mb-3">
                         <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Confidence Index</p>
                         <p className="text-xs font-black text-white tracking-widest">{(status.prediction.confidence_score * 100).toFixed(0)}%</p>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${status.prediction.confidence_score * 100}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-accent to-primary"
                        ></motion.div>
                      </div>
                    </div>

                    <div className="glass-alt rounded-3xl p-6 border border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                         <Clock className="w-16 h-16" />
                      </div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Predicted Next Stop</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white tracking-tighter">04:22</span>
                        <span className="text-lg font-black text-slate-500 uppercase tracking-widest">PM</span>
                      </div>
                      <div className="flex items-center gap-2 mt-4 text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-500/10 w-fit border border-emerald-500/20">
                         <ShieldCheck className="w-3.5 h-3.5" />
                         <span className="text-[10px] font-black uppercase tracking-widest">On Schedule</span>
                      </div>
                    </div>
                 </div>
               </div>
            </motion.div>

            {/* Timeline Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-[2.5rem] p-8 border border-white/5 flex flex-col max-h-[700px] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <History className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-black text-white tracking-tighter">Route Log</h3>
                 </div>
                 <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    {train.routeStations.length} Checkpoints
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar">
                {train.routeStations.map((station, idx) => (
                  <TimelineItem 
                    key={idx}
                    station={station}
                    isLast={idx === train.routeStations.length - 1}
                    isCurrent={station.stationName === status.currentStation}
                    isPassed={idx < train.routeStations.findIndex(s => s.stationName === status.currentStation)}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrainDetails;

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
