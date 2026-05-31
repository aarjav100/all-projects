import React, { useState, useEffect } from 'react';
import { Search, Train, ArrowRight, Clock, MapPin, AlertTriangle, Filter, ChevronDown, List, Zap, Star } from 'lucide-react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard = () => {
  const [query, setQuery] = useState('');
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [liveStation, setLiveStation] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [stationSuggestions, setStationSuggestions] = useState([]);
  const [searchMode, setSearchMode] = useState('number'); 
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); 
  const [sortBy, setSortBy] = useState('earliest');

  const processedResults = [...results]
    .filter(train => {
      if (searchMode === 'station') return true;
      if (train.type === 'connection') return true;
      if (filter === 'all') return true;
      const fromData = train.routeStations?.find(s => s.stationName === fromStation || s.stationCode === fromStation);
      if (!fromData) return true;
      const hour = parseInt(fromData.scheduledArrivalTime.split(':')[0]);
      if (filter === 'morning') return hour >= 5 && hour < 12;
      if (filter === 'evening') return hour >= 17 && hour < 24;
      return true;
    })
    .sort((a, b) => {
      if (searchMode === 'station') {
        const aTime = a.stationContext?.arrival || a.stationContext?.departure || '';
        const bTime = b.stationContext?.arrival || b.stationContext?.departure || '';
        return aTime.localeCompare(bTime);
      }
      if (a.type === 'connection' || b.type === 'connection') return 0;
      if (sortBy === 'earliest') {
        const aFrom = a.routeStations?.find(s => s.stationName === fromStation || s.stationCode === fromStation);
        const bFrom = b.routeStations?.find(s => s.stationName === fromStation || s.stationCode === fromStation);
        return (aFrom?.scheduledArrivalTime || '').localeCompare(bFrom?.scheduledArrivalTime || '');
      }
      if (sortBy === 'fastest') {
        const getDurationVal = (train) => {
          const start = train.routeStations?.find(s => s.stationName === fromStation || s.stationCode === fromStation);
          const end = train.routeStations?.find(s => s.stationName === toStation || s.stationCode === toStation);
          if (!start || !end) return Infinity;
          const [sH, sM] = start.scheduledArrivalTime.split(':').map(Number);
          const [eH, eM] = end.scheduledArrivalTime.split(':').map(Number);
          let diff = (eH * 60 + eM) - (sH * 60 + sM);
          if (diff < 0) diff += 24 * 60;
          return diff;
        };
        return getDurationVal(a) - getDurationVal(b);
      }
      return 0;
    });

  const formatTime12h = (timeStr) => {
    if (!timeStr) return '--:--';
    let [hours, minutes] = timeStr.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  };

  const fetchSuggestions = async (val, setter) => {
    if (val.length < 1) {
      setter([]);
      return;
    }
    try {
      const res = await api.get(`/trains/stations?q=${val}`);
      setter(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchSuggestions(fromStation, setFromSuggestions), 300);
    return () => clearTimeout(timer);
  }, [fromStation]);

  useEffect(() => {
    const timer = setTimeout(() => fetchSuggestions(liveStation, setStationSuggestions), 300);
    return () => clearTimeout(timer);
  }, [liveStation]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFromSuggestions([]);
    setToSuggestions([]);
    
    try {
      let res;
      if (searchMode === 'number') {
        if (!query) return;
        res = await api.get(`/trains/search?q=${query}`);
      } else if (searchMode === 'route') {
        if (!fromStation || !toStation) return;
        res = await api.get(`/trains/search/route?from=${fromStation}&to=${toStation}`);
      } else if (searchMode === 'station') {
        if (!liveStation) return;
        res = await api.get(`/trains/station/${liveStation}`);
      }
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const swapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const SuggestionBox = ({ suggestions, onSelect }) => (
    <AnimatePresence>
      {suggestions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute left-0 right-0 top-full mt-3 glass-alt rounded-2xl shadow-2xl z-50 py-3 overflow-hidden border border-white/10"
        >
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onSelect(s)}
              className="w-full text-left px-6 py-4 hover:bg-white/5 flex items-center justify-between transition-colors group"
            >
              <div>
                <p className="font-bold text-white group-hover:text-primary transition-colors">{s.stationName}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.stationCode}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-all group-hover:translate-x-1" />
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <Layout>
      <div className="space-y-12">
        {/* Header Section */}
        <section className="text-center space-y-6 relative py-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em]"
          >
            <Zap className="w-3 h-3 fill-primary" />
            Real-time tracking enabled
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter"
          >
            Where is your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Train?</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto font-medium"
          >
            Instant access to live schedules, platform numbers, and delays across the entire Indian Railway network.
          </motion.p>
        </section>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="glass p-1.5 rounded-2xl border border-white/5 flex gap-1 shadow-2xl shadow-indigo-500/5">
            {[
              { id: 'number', label: 'By Number', icon: List },
              { id: 'route', label: 'Route Plan', icon: Navigation },
              { id: 'station', label: 'Live Station', icon: MapPin }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setSearchMode(tab.id)}
                className={`relative px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 overflow-hidden ${searchMode === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {searchMode === tab.id && (
                  <motion.div 
                    layoutId="tab-active"
                    className="absolute inset-0 bg-primary shadow-lg shadow-primary/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Controls */}
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={searchMode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {searchMode === 'number' ? (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="relative glass-alt border border-white/10 rounded-[2.5rem] p-3 flex gap-3 shadow-2xl">
                    <div className="flex-1 relative">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-primary" />
                      <input 
                        type="text" 
                        className="w-full pl-16 pr-6 py-6 bg-transparent border-none focus:ring-0 text-xl font-bold text-white placeholder:text-slate-600"
                        placeholder="Enter Train Number (e.g. 12017)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>
                    <button 
                      type="submit"
                      className="bg-primary hover:bg-primary-dark text-white px-10 rounded-[1.75rem] font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                      Locate
                    </button>
                  </div>
                </div>
              ) : searchMode === 'route' ? (
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div className="relative flex-1 group w-full">
                    <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <div className="relative glass-alt border border-white/10 rounded-3xl p-2">
                       <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-slate-600 tracking-widest">From</span>
                       <input 
                        type="text" 
                        className="w-full pl-20 pr-6 py-5 bg-transparent border-none focus:ring-0 text-lg font-bold text-white placeholder:text-slate-700"
                        placeholder="Departure Station"
                        value={fromStation}
                        onChange={(e) => setFromStation(e.target.value)}
                      />
                      <SuggestionBox suggestions={fromSuggestions} onSelect={(s) => { setFromStation(s.stationName); setFromSuggestions([]); }} />
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={swapStations}
                    className="glass-alt p-4 rounded-2xl hover:text-primary transition-colors active:scale-90"
                  >
                    <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0" />
                  </button>

                  <div className="relative flex-1 group w-full">
                    <div className="relative glass-alt border border-white/10 rounded-3xl p-2">
                       <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-slate-600 tracking-widest">To</span>
                       <input 
                        type="text" 
                        className="w-full pl-16 pr-6 py-5 bg-transparent border-none focus:ring-0 text-lg font-bold text-white placeholder:text-slate-700"
                        placeholder="Destination Station"
                        value={toStation}
                        onChange={(e) => setToStation(e.target.value)}
                      />
                      <SuggestionBox suggestions={toSuggestions} onSelect={(s) => { setToStation(s.stationName); setToSuggestions([]); }} />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white px-10 py-7 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/30 active:scale-95 transition-all"
                  >
                    Search
                  </button>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div className="relative flex-1 group w-full">
                    <div className="relative glass-alt border border-white/10 rounded-3xl p-2">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary" />
                      <input 
                        type="text" 
                        className="w-full pl-16 pr-6 py-5 bg-transparent border-none focus:ring-0 text-lg font-bold text-white placeholder:text-slate-700"
                        placeholder="Search Station for Boarding info"
                        value={liveStation}
                        onChange={(e) => setLiveStation(e.target.value)}
                      />
                      <SuggestionBox suggestions={stationSuggestions} onSelect={(s) => { setLiveStation(s.stationName); setStationSuggestions([]); }} />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white px-12 py-7 rounded-3xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
                  >
                    Fetch Board
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {searchMode === 'route' && results.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center justify-between gap-4 py-4 px-8 mt-6 glass rounded-2xl border border-white/5"
            >
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Filter</span>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                  {['all', 'morning', 'evening'].map(f => (
                    <button key={f} type="button" onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sort</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="earliest">Earliest Departure</option>
                  <option value="fastest">Fastest Journey</option>
                </select>
              </div>
            </motion.div>
          )}
        </form>

        {/* Results Grid */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse"></div>
              </div>
              <p className="text-slate-400 font-bold tracking-widest animate-pulse uppercase text-xs">Accessing Satellite Data...</p>
            </div>
          ) : processedResults.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {processedResults.map((train, idx) => {
                  const isConnection = train.type === 'connection';
                  
                  if (isConnection) {
                    return (
                      <motion.div 
                        key={`conn-${idx}`}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-accent/30 transition-all border border-white/5 shadow-2xl"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl -mr-16 -mt-16"></div>
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/20">
                              <Navigation className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                              <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Connection Plan</span>
                              <h3 className="text-lg font-black text-white mt-1">Switch at {train.connectionStation}</h3>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="relative glass-alt p-6 rounded-3xl border border-white/5">
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-3">{train.train1.trainName}</p>
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-2xl font-black text-white">{formatTime12h(train.departureTime)}</p>
                                <p className="text-[10px] font-bold text-slate-400">Boarding Point</p>
                              </div>
                              <ArrowRight className="w-5 h-5 text-slate-700" />
                              <div className="text-right">
                                <p className="text-2xl font-black text-white">{formatTime12h(train.train1.routeStations.find(s => s.stationName === train.connectionStation)?.scheduledArrivalTime)}</p>
                                <p className="text-[10px] font-bold text-slate-400">Arrival at {train.connectionStation}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-center gap-3">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
                            <span className="text-[10px] font-black uppercase text-accent tracking-widest">{train.transferTime || 'Layover'}</span>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
                          </div>

                          <div className="relative glass-alt p-6 rounded-3xl border border-white/5 shadow-2xl">
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-3">{train.train2.trainName}</p>
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-2xl font-black text-white">{formatTime12h(train.train2.routeStations.find(s => s.stationName === train.connectionStation)?.scheduledDepartureTime)}</p>
                                <p className="text-[10px] font-bold text-slate-400">Depart {train.connectionStation}</p>
                              </div>
                              <ArrowRight className="w-5 h-5 text-slate-700" />
                              <div className="text-right">
                                <p className="text-2xl font-black text-white">{formatTime12h(train.arrivalTime)}</p>
                                <p className="text-[10px] font-bold text-slate-400">Final Destination</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  const fromData = train.routeStations?.find(s => s.stationName === fromStation || s.stationCode === fromStation);
                  const toData = train.routeStations?.find(s => s.stationName === toStation || s.stationCode === toStation);
                  const stops = train.routeStations?.slice(
                    train.routeStations?.findIndex(s => s.stationCode === fromData?.stationCode),
                    train.routeStations?.findIndex(s => s.stationCode === toData?.stationCode) + 1
                  ) || [];

                  return (
                    <motion.div 
                      key={train.trainNumber}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card rounded-[2.5rem] hover:border-primary/40 transition-all group relative overflow-hidden flex flex-col border border-white/5"
                    >
                      {/* Glow Overlay */}
                      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] -ml-20 -mt-20 group-hover:opacity-100 opacity-50 transition-opacity"></div>
                      
                      <div className="p-8 relative z-10 flex-1">
                        <div className="flex items-start justify-between mb-8">
                          <div className="flex items-center gap-5">
                            <div className="relative group/icon">
                              <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur opacity-0 group-hover/icon:opacity-100 transition-opacity"></div>
                              <div className="relative bg-slate-900 border border-white/10 p-5 rounded-2xl group-hover:scale-110 transition-transform shadow-2xl">
                                <Train className="w-7 h-7 text-primary" />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <h3 className="text-2xl font-black text-white leading-tight tracking-tight">{train.trainName}</h3>
                                {train.isRealTime && (
                                  <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-500/20 animate-pulse">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></div>
                                    Live
                                  </div>
                                )}
                              </div>
                              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">#{train.trainNumber} • {train.type}</p>
                            </div>
                          </div>
                          
                          <button className="p-3 glass-alt rounded-2xl text-slate-500 hover:text-yellow-400 transition-colors active:scale-90 border border-white/5">
                            <Star className="w-5 h-5" />
                          </button>
                        </div>

                        {searchMode === 'station' ? (
                          <div className="grid grid-cols-2 gap-4 mb-2">
                             <div className="glass-alt p-6 rounded-[2rem] text-center border border-white/5 shadow-xl">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Platform</p>
                                <p className="text-3xl font-black text-white">{train.stationContext?.platform || 'TBA'}</p>
                             </div>
                             <div className="glass-alt p-6 rounded-[2rem] text-center border border-white/5 shadow-xl">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Boarding</p>
                                <p className="text-2xl font-black text-white">{formatTime12h(train.stationContext?.arrival || train.stationContext?.departure)}</p>
                                {train.stationContext?.delay && train.stationContext.delay !== '0' && (
                                  <p className="text-[9px] font-black text-red-400 mt-1">+{train.stationContext.delay}m Delay</p>
                                )}
                             </div>
                          </div>
                        ) : (
                          <div className="relative glass-alt rounded-[2.5rem] p-8 border border-white/5 shadow-2xl mb-6 group/route overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>
                             <div className="flex justify-between items-center relative z-10">
                               <div className="flex-1">
                                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Source</p>
                                  <p className="text-3xl font-black text-white tracking-tighter">{formatTime12h(fromData?.scheduledArrivalTime)}</p>
                                  <p className="text-xs font-bold text-slate-400 truncate max-w-[120px] mt-1">{fromData?.stationName}</p>
                               </div>

                               <div className="flex flex-col items-center gap-2 group-hover/route:scale-110 transition-transform">
                                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-slate-900 group-hover:border-primary/50 transition-colors">
                                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
                                  </div>
                                  <span className="text-[9px] font-black text-slate-600 group-hover:text-primary transition-colors uppercase tracking-widest">Journey</span>
                               </div>

                               <div className="flex-1 text-right">
                                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Destination</p>
                                  <p className="text-3xl font-black text-white tracking-tighter">{formatTime12h(toData?.scheduledArrivalTime)}</p>
                                  <p className="text-xs font-bold text-slate-400 truncate max-w-[120px] ml-auto mt-1">{toData?.stationName}</p>
                               </div>
                             </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-slate-500 font-bold px-4">
                           <div className="flex items-center gap-2">
                             <Clock className="w-4 h-4 text-primary" />
                             <span className="text-xs text-white">Daily Run</span>
                           </div>
                           <details className="group/details relative">
                              <summary className="flex items-center gap-2 cursor-pointer list-none text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                                 Stops • {stops.length > 0 ? stops.length : 'Full Route'}
                                 <ChevronDown className="w-3 h-3 group-open/details:rotate-180 transition-transform" />
                              </summary>
                              {/* Summary content can go here if needed */}
                           </details>
                        </div>
                      </div>

                      <Link 
                        to={`/train/${train.trainNumber}`} 
                        className="relative h-16 flex items-center justify-center group/btn overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/5 group-hover/btn:bg-primary transition-colors"></div>
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5"></div>
                        <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover/btn:text-white transition-colors flex items-center gap-3">
                          <Navigation className="w-4 h-4" />
                          Track Live Location
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          ) : query && !loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-40 glass rounded-[3rem] border border-dashed border-white/10"
            >
              <div className="inline-flex p-8 rounded-full bg-white/5 mb-6">
                <AlertTriangle className="w-12 h-12 text-slate-700" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">No signal found.</h2>
              <p className="text-slate-500 font-medium">We couldn't find any trains matching "{query}". Check the number and try again.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
               {[
                 { title: 'Live Dashboards', desc: 'Real-time arrival and departure boards for any station in India.', icon: List, color: 'bg-primary/20 text-primary' },
                 { title: 'Smart Routes', desc: 'Find connected trains when no direct service is available.', icon: Navigation, color: 'bg-accent/20 text-accent' },
                 { title: 'Exact Tracking', desc: 'GPS-level precision for live train locations and delays.', icon: MapPin, color: 'bg-white/10 text-white' }
               ].map((feat, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3 + (i * 0.1) }}
                   className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1"
                 >
                    <div className={`${feat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
                       <feat.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-white mb-3 tracking-tighter">{feat.title}</h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{feat.desc}</p>
                 </motion.div>
               ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

