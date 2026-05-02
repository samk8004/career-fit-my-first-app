/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, ReactNode } from 'react';
import { 
  Search, 
  Ruler, 
  HelpCircle, 
  CheckCircle2, 
  ChevronRight, 
  Briefcase, 
  User, 
  Info,
  ArrowRight,
  ShieldCheck,
  Plane,
  Anchor,
  Camera,
  Trees,
  SearchCheck,
  Building2,
  TrendingUp,
  CreditCard,
  Menu,
  X,
  Star,
  Languages,
  Clock,
  Zap,
  Gift,
  Globe,
  MapPin,
  GraduationCap,
  UserCheck,
  Map,
  Heart,
  Mail,
  Instagram,
  Bell,
  BellRing
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jobs, faqs, Job, languages, Language, uiTranslations } from './data/jobs';

type Section = 'eligibility' | 'name' | 'top' | 'alerts' | 'saved' | 'faq' | 'contact';
type Gender = 'male' | 'female';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('eligibility');
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [gender, setGender] = useState<Gender>('male');
  const [heightInput, setHeightInput] = useState<string>('');
  const [ageInput, setAgeInput] = useState<string>('');
  const [nameSearch, setNameSearch] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [alertCriteria, setAlertCriteria] = useState({ height: '', age: '', category: 'all' });
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('savedJobIds');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleToggleSave = (jobId: string) => {
    setSavedJobIds(prev => {
      const next = prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId];
      localStorage.setItem('savedJobIds', JSON.stringify(next));
      return next;
    });
  };

  const handleEnableAlerts = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setAlertsEnabled(true);
          new Notification('Job Alerts Enabled!', {
            body: 'You will now receive notifications for new jobs matching your criteria.'
          });
        }
      });
    } else {
      setAlertsEnabled(true); // Fallback for browsers without notification support
    }
  };

  // Helper for translation
  const t = (key: string) => {
    return uiTranslations[currentLang]?.[key] || uiTranslations['en'][key] || key;
  };

  const filteredByEligibility = useMemo(() => {
    const height = parseFloat(heightInput);
    const age = parseInt(ageInput, 10);
    
    // If both empty, return empty array
    if (isNaN(height) && isNaN(age)) return [];
    
    return jobs.filter(job => {
      let isEligible = true;
      
      // Check Height
      if (!isNaN(height)) {
        const minHeight = gender === 'male' ? job.minHeightMale : job.minHeightFemale;
        if (minHeight > 0 && height < minHeight) {
          isEligible = false;
        }
      }
      
      // Check Age
      if (!isNaN(age) && isEligible) {
        const ageStr = job.ageRange.toLowerCase();
        let matchesAge = false;
        if (ageStr.includes('no limit')) {
          matchesAge = age >= 18;
        } else {
          const match = ageStr.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+)/);
          if (match) {
            const min = parseFloat(match[1]);
            const max = parseInt(match[2], 10);
            matchesAge = age >= min && age <= max;
          } else {
            const minMatch = ageStr.match(/under\s*(\d+)/);
            if (minMatch) {
               matchesAge = age < parseInt(minMatch[1], 10);
            }
          }
        }
        if (!matchesAge) {
          isEligible = false;
        }
      }
      
      return isEligible;
    });
  }, [heightInput, ageInput, gender]);

  const filteredByName = useMemo(() => {
    if (!nameSearch) return [];
    const search = nameSearch.toLowerCase();
    return jobs.filter(job => 
      job.name.toLowerCase().includes(search) ||
      job.description.toLowerCase().includes(search) ||
      job.category.toLowerCase().includes(search) ||
      job.salary.toLowerCase().includes(search) ||
      job.qualification.toLowerCase().includes(search) ||
      job.targetStudents.toLowerCase().includes(search) ||
      job.ageRange.toLowerCase().includes(search) ||
      job.states.some(state => state.toLowerCase().includes(search))
    );
  }, [nameSearch]);

  const topJobs = useMemo(() => {
    const popularIds = [
      "ias-officer", 
      "bank-po", 
      "ibps-clerk",
      "ssc-cgl-it-inspector", 
      "ssc-gd-constable", 
      "ssc-chsl", 
      "nda-officer", 
      "upsc-cds", 
      "police-constable", 
      "indian-army",
      "rbi-grade-b",
      "sbi-po",
      "rrb-ntpc"
    ];
    // Return jobs that are in the list, or if isPopularGovtJob is set
    return jobs.filter(j => popularIds.includes(j.id) || j.isPopularGovtJob).sort((a, b) => b.salaryValue - a.salaryValue);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden">
      {/* Background blobs for interesting UI */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 mix-blend-multiply blur-[120px] animate-blob" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-pink-400/20 mix-blend-multiply blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 mix-blend-multiply blur-[120px] animate-blob animation-delay-4000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveSection('height')}>
              <div className="bg-blue-600 p-2 rounded-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight text-slate-900">
                Career<span className="text-blue-600">Fit</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {[
                { id: 'eligibility', label: t('heightTab') },
                { id: 'name', label: t('searchTab') },
                { id: 'top', label: t('topTab') },
                { id: 'alerts', label: t('alertsTab') },
                { id: 'saved', label: t('savedTab') },
                { id: 'faq', label: t('faqTab') },
                { id: 'contact', label: t('contactTab') }
              ].map((link) => (
                <button 
                  key={link.id}
                  onClick={() => setActiveSection(link.id as Section)}
                  className={`text-sm font-bold transition-colors ${activeSection === link.id ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                >
                  {link.label}
                </button>
              ))}

              {/* Language Switcher */}
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
                <Globe className="w-4 h-4 text-slate-400" />
                <select 
                  value={currentLang}
                  onChange={(e) => setCurrentLang(e.target.value)}
                  className="text-xs font-bold text-slate-600 bg-transparent focus:outline-none cursor-pointer"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.nativeName}</option>
                  ))}
                </select>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {[
                  { id: 'eligibility', label: t('heightTab') },
                  { id: 'name', label: t('searchTab') },
                  { id: 'top', label: t('topTab') },
                  { id: 'alerts', label: t('alertsTab') },
                  { id: 'saved', label: t('savedTab') },
                  { id: 'faq', label: t('faqTab') },
                  { id: 'contact', label: t('contactTab') }
                ].map((link) => (
                  <button 
                    key={link.id}
                    onClick={() => { setActiveSection(link.id as Section); setIsMobileMenuOpen(false); }}
                    className={`block w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${activeSection === link.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                  >
                    {link.label}
                  </button>
                ))}
                {/* Mobile Language Switcher */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 block mb-2">{t('selectLanguage')}</label>
                  <div className="flex flex-wrap gap-2 px-4">
                    {['en', 'hi'].map(langCode => (
                      <button 
                        key={langCode}
                        onClick={() => { setCurrentLang(langCode); setIsMobileMenuOpen(false); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currentLang === langCode ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                      >
                        {languages.find(l => l.code === langCode)?.nativeName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4"
          >
            {activeSection === 'top' ? t('topTab') : t('heroTitle')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            {activeSection === 'top' 
              ? 'Most sought-after government jobs with high prestige, excellent facilities, and job security.'
              : activeSection === 'name'
              ? t('searchDescription')
              : t('heroSub')}
          </motion.p>
        </div>

        {/* Section Navigation Desktop */}
        <div className="flex justify-center mb-12 relative z-10">
          <div className="inline-flex p-1 bg-white/60 backdrop-blur-xl rounded-2xl overflow-x-auto max-w-full no-scrollbar shadow-sm border border-slate-200/50">
            {(['eligibility', 'name', 'top', 'alerts', 'saved', 'faq', 'contact'] as Section[]).map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  activeSection === section 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-500 hover:text-blue-600'
                }`}
              >
                {section === 'eligibility' ? t('heightTab') : section === 'name' ? t('searchTab') : section === 'top' ? t('topTab') : section === 'saved' ? t('savedTab') : section === 'alerts' ? t('alertsTab') : section === 'contact' ? t('contactTab') : t('faqTab')}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-4xl mx-auto relative z-10"
        >
          {activeSection === 'eligibility' && (
            <div className="space-y-8">
              {/* Eligibility Filter Form */}
              <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white">
                <div className="flex flex-col md:flex-row gap-8 items-end">
                  <div className="w-full md:w-64 space-y-4">
                    <label className="text-sm font-bold text-slate-700 block ml-1 uppercase tracking-wider">
                      {t('selectGender')}
                    </label>
                    <div className="grid grid-cols-2 gap-4 p-1 bg-slate-100 rounded-xl">
                      <button 
                        onClick={() => { setGender('male'); setSelectedJobId(null); }}
                        className={`flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${gender === 'male' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <User className="w-4 h-4" /> {t('male')}
                      </button>
                      <button 
                        onClick={() => { setGender('female'); setSelectedJobId(null); }}
                        className={`flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${gender === 'female' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <User className="w-4 h-4" /> {t('female')}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full space-y-4">
                    <label className="text-sm font-bold text-slate-700 block ml-1 uppercase tracking-wider">
                      {t('yourHeight')}
                    </label>
                    <div className="relative">
                      <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="number" 
                        min="0"
                        value={heightInput}
                        onChange={(e) => { 
                          if (parseFloat(e.target.value) < 0) return;
                          setHeightInput(e.target.value); 
                          setSelectedJobId(null); 
                        }}
                        placeholder={t('heightPlaceholder')}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-4">
                    <label className="text-sm font-bold text-slate-700 block ml-1 uppercase tracking-wider">
                      {t('yourAge')}
                    </label>
                    <div className="relative">
                      <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="number" 
                        min="0"
                        value={ageInput}
                        onChange={(e) => { 
                          if (parseInt(e.target.value, 10) < 0) return;
                          setAgeInput(e.target.value); 
                          setSelectedJobId(null); 
                        }}
                        placeholder={t('enterAgePlaceholder')}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

               {/* Results */}
              <div className="space-y-6">
                {!selectedJobId ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        {(heightInput || ageInput) ? (
                          <>
                          <SearchCheck className="text-blue-600" />
                          {t('suitableJobs')}
                        </>
                      ) : (
                        <>
                          <Info className="text-slate-400" />
                          {t('enterHeightText')}
                        </>
                      )}
                    </h3>
                    {(heightInput || ageInput) && <span className="text-sm text-slate-500 font-medium">{filteredByEligibility.length} matches found</span>}
                  </div>

                  {(heightInput || ageInput) && filteredByEligibility.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredByEligibility.map((job) => (
                        <div key={job.id} onClick={() => setSelectedJobId(job.id)} className="cursor-pointer">
                          <JobCard job={job} gender={gender} t={t} isSaved={savedJobIds.includes(job.id)} onToggleSave={(e) => { e.stopPropagation(); handleToggleSave(job.id); }} />
                        </div>
                      ))}
                    </div>
                  ) : (heightInput || ageInput) ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
                      <p className="text-slate-500 font-medium">{t('noMatches')}</p>
                    </div>
                  ) : null}
                  </>
                ) : (
                  <div className="space-y-4">
                    <button 
                      onClick={() => setSelectedJobId(null)}
                      className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm bg-white border border-slate-200 px-4 py-2 rounded-xl transition-all shadow-sm"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" /> Back to matches
                    </button>
                    {filteredByEligibility.find(j => j.id === selectedJobId) && (
                      <DetailedJobCard 
                        job={filteredByEligibility.find(j => j.id === selectedJobId)!} 
                        t={t} 
                        isSaved={savedJobIds.includes(selectedJobId)} 
                        onToggleSave={() => handleToggleSave(selectedJobId)}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'name' && (
            <div className="space-y-8">
              {/* Job Search Form */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 transition-all focus-within:ring-2 focus-within:ring-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-50 rounded-2xl">
                    <Search className="text-blue-600 w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{t('govtPortal')}</h2>
                    <p className="text-sm text-slate-500 font-medium">Search central and state government opportunities</p>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                  <input 
                    type="text" 
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full pl-16 pr-6 py-5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition-all placeholder:text-slate-400 text-lg font-medium shadow-inner"
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['SSC', 'UPSC', 'State PSC', 'Railway', 'Police', 'Teaching', 'Banking', 'Defense'].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setNameSearch(tag)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg transition-colors uppercase tracking-wider"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div className="space-y-6">
                {nameSearch ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-800">
                        {filteredByName.length > 0 ? 'Govt Job Matches' : 'No Results Found'}
                      </h3>
                      <span className="text-sm text-slate-500 font-medium">{filteredByName.length} jobs identified</span>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {filteredByName.map((job) => (
                        <DetailedJobCard 
                          key={job.id} 
                          job={job} 
                          t={t} 
                          isSaved={savedJobIds.includes(job.id)} 
                          onToggleSave={() => handleToggleSave(job.id)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CategoryCard onClick={() => setNameSearch("Defense")} icon={<ShieldCheck className="text-blue-600" />} label="Defense & Police" description="Army, Navy, State Police, BSF." />
                    <CategoryCard onClick={() => setNameSearch("Civil")} icon={<Building2 className="text-indigo-600" />} label="Civil Services" description="IAS, IPS, State PSC, SSC CGL." />
                    <CategoryCard onClick={() => setNameSearch("Education")} icon={<GraduationCap className="text-emerald-600" />} label="Education" description="TGT, PGT, Govt Schools." />
                    <CategoryCard onClick={() => setNameSearch("State")} icon={<Map className="text-orange-600" />} label="State Level" description="Patwari, VDO, Tehsildar." />
                    <CategoryCard onClick={() => setNameSearch("Tech")} icon={<Zap className="text-amber-600" />} label="Technical" description="SSC JE, DRDO, ISRO." />
                    <CategoryCard onClick={() => setNameSearch("Bank")} icon={<CreditCard className="text-slate-600" />} label="Banking" description="Bank PO, Clerk, RBI." />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'saved' && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="text-pink-500 fill-pink-500 w-8 h-8" />
                <h2 className="text-2xl font-bold text-slate-900 font-display">{t('savedTab')}</h2>
              </div>
              
              <div className="space-y-6">
                {savedJobIds.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobs.filter(j => savedJobIds.includes(j.id)).map(job => (
                      <div key={job.id} onClick={() => { setActiveSection('name'); setNameSearch(job.name); }} className="cursor-pointer">
                        <JobCard job={job} gender={gender} t={t} isSaved={true} onToggleSave={(e) => { e.stopPropagation(); handleToggleSave(job.id); }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
                    <Heart className="text-slate-300 w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg text-slate-500 font-medium">No saved jobs yet.</p>
                    <p className="text-slate-400 mt-2">Click the heart icon on any job to save it here!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'alerts' && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500 rounded-2xl relative shadow-lg shadow-blue-500/20">
                  <BellRing className="text-white w-6 h-6 animate-pulse" />
                  <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-ping" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 font-display">{t('alertsTab')}</h2>
              </div>
              
              <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-indigo-900/5 border border-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply blur-3xl opacity-50 group-hover:bg-blue-100 transition-colors duration-700" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Never miss a matching job</h3>
                  <p className="text-slate-600 mb-8 max-w-lg">Set up alerts to get an instant notification on your device whenever a new government job is posted that matches your criteria.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Preferred Category</label>
                      <select 
                        value={alertCriteria.category}
                        onChange={(e) => setAlertCriteria({...alertCriteria, category: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition-all font-medium text-slate-700"
                      >
                        <option value="all">Every Government Job</option>
                        <option value="defense">Defense & Police</option>
                        <option value="civil">Civil Services</option>
                        <option value="bank">Banking & Finance</option>
                        <option value="railway">Railways</option>
                        <option value="tech">Tech & Engineering</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">My Height</label>
                        <input 
                          type="number" min="0" 
                          value={alertCriteria.height}
                          onChange={(e) => setAlertCriteria({...alertCriteria, height: e.target.value})}
                          placeholder="Wait..."
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition-all placeholder:text-slate-400"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">My Age</label>
                        <input 
                          type="number" min="0" 
                          value={alertCriteria.age}
                          onChange={(e) => setAlertCriteria({...alertCriteria, age: e.target.value})}
                          placeholder="e.g. 21"
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${alertsEnabled ? 'bg-blue-500' : 'bg-slate-200'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${alertsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                      <span className="font-bold text-slate-700">{alertsEnabled ? 'Active' : 'Inactive'}</span>
                    </div>

                    <button 
                      onClick={handleEnableAlerts}
                      disabled={alertsEnabled}
                      className={`px-8 py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 ${alertsEnabled ? 'bg-emerald-50 text-emerald-600 shadow-none' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'}`}
                    >
                      {alertsEnabled ? (
                        <><CheckCircle2 className="w-5 h-5" /> Alerts Enabled</>
                      ) : (
                        <><Bell className="w-5 h-5" /> Enable Push Notifications</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'top' && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-4">
                <Star className="text-amber-500 fill-amber-500" />
                <h2 className="text-2xl font-bold text-slate-900 font-display">{t('topTab')}</h2>
              </div>
              
              <div className="space-y-6">
                {topJobs.map((job) => (
                  <TopJobCard 
                    key={job.id} 
                    job={job} 
                    t={t} 
                    isSaved={savedJobIds.includes(job.id)}
                    onToggleSave={(e) => { e.stopPropagation(); handleToggleSave(job.id); }}
                  />
                ))}
              </div>
            </div>
          )}

          {activeSection === 'faq' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <HelpCircle className="text-blue-600 w-8 h-8" /> 
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                  >
                    <details className="group">
                      <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                        <span className="font-bold text-slate-800 pr-4">{faq.question}</span>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform" />
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                        {faq.answer}
                      </div>
                    </details>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="text-blue-500 w-8 h-8" />
                <h2 className="text-2xl font-bold text-slate-900 font-display">{t('contactTab')}</h2>
              </div>
              
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 mt-6 max-w-2xl mx-auto text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-white" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 bg-white rounded-full p-2 shadow-xl shadow-blue-900/5 border border-blue-100 flex items-center justify-center mb-6">
                    <User className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">Satyam Kushwaha</h3>
                  <p className="text-blue-600 font-bold mb-8 uppercase tracking-widest text-sm">Lead Developer</p>
                  
                  <div className="w-full space-y-4">
                    <a href="mailto:satyamskgfrocky07@gmail.com" className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-200 group">
                      <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                        <Mail className="w-6 h-6 text-indigo-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Us</p>
                        <p className="font-bold text-slate-800">satyamskgfrocky07@gmail.com</p>
                      </div>
                    </a>
                    
                    <a href="https://instagram.com/nexus_vibeshq" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-200 group">
                      <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                        <Instagram className="w-6 h-6 text-pink-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Instagram</p>
                        <p className="font-bold text-slate-800">@nexus_vibeshq</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-md">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-display font-bold tracking-tight text-slate-900">
                  Career<span className="text-blue-600">Fit</span>
                </span>
              </div>
              <p className="text-slate-500 max-w-sm">
                Empowering students to find the right career path by providing accurate physical standards and job requirements across various sectors.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-2 text-slate-500 text-sm font-medium">
                <li><button onClick={() => setActiveSection('eligibility')} className="hover:text-blue-600 transition-colors">{t('heightTab')}</button></li>
                <li><button onClick={() => setActiveSection('top')} className="hover:text-blue-600 transition-colors">{t('topTab')}</button></li>
                <li><button onClick={() => setActiveSection('saved')} className="hover:text-blue-600 transition-colors">{t('savedTab')}</button></li>
                <li><button onClick={() => setActiveSection('faq')} className="hover:text-blue-600 transition-colors">{t('faqTab')}</button></li>
                <li><button onClick={() => setActiveSection('contact')} className="hover:text-blue-600 transition-colors">{t('contactTab')}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Student Resources</h4>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer">
                  <Languages className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer">
                  <User className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4">
            <p>© 2026 CareerFit Student Portal. All rights reserved.</p>
            <div className="flex gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Support Components
function CategoryCard({ icon, label, description, onClick }: { icon: ReactNode, label: string, description: string, onClick?: () => void }) {
  return (
    <div onClick={onClick} className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer group">
      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="font-bold text-slate-800 mb-2">{label}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

interface JobCardProps {
  job: Job;
  gender: 'male' | 'female';
  t: (key: string) => string;
  isSaved?: boolean;
  onToggleSave?: (e: React.MouseEvent) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, gender, t, isSaved, onToggleSave }) => {
  const minHeight = gender === 'male' ? job.minHeightMale : job.minHeightFemale;
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all relative flex flex-col h-full"
    >
      <button 
        onClick={onToggleSave}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-50 transition-colors z-10"
      >
        <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'fill-pink-500 text-pink-500' : 'text-slate-300 hover:text-pink-400'}`} />
      </button>

      <div className="flex justify-between items-start mb-4 pr-12">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 mb-1 block">
            {job.category}
          </span>
          <h4 className="font-bold text-lg text-slate-900 leading-tight">{job.name}</h4>
        </div>
      </div>
      <div className="bg-slate-50 self-start px-3 py-1 rounded-full text-xs font-bold text-slate-600 border border-slate-100 mb-4">
        {minHeight > 0 ? `${minHeight}cm min` : "No limit"}
      </div>
      <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
        {job.description}
      </p>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
        <span className="text-xs font-bold text-emerald-600">{job.salary}</span>
        <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

interface DetailedJobCardProps {
  job: Job;
  t: (key: string) => string;
  isSaved?: boolean;
  onToggleSave?: (e: React.MouseEvent) => void;
}

const DetailedJobCard: React.FC<DetailedJobCardProps> = ({ job, t, isSaved, onToggleSave }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all group p-8 relative">
      <button 
        onClick={onToggleSave}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
      >
        <Heart className={`w-6 h-6 transition-colors ${isSaved ? 'fill-pink-500 text-pink-500' : 'text-slate-300 hover:text-pink-400'}`} />
      </button>

      <div className="flex flex-wrap items-center gap-3 mb-4 pr-14">
        <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {job.category}
        </span>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Ruler className="w-3.5 h-3.5" />
          {t('yourHeight')}: M: {job.minHeightMale}cm | F: {job.minHeightFemale}cm
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{job.name}</h3>
      <p className="text-slate-600 mb-6 leading-relaxed max-w-2xl">{job.description}</p>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
          <GraduationCap className="w-4 h-4 text-emerald-500" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">{t('qualification')}</p>
            <p className="text-sm font-bold text-slate-700">{job.qualification}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
          <UserCheck className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">{t('targetStudents')}</p>
            <p className="text-sm font-bold text-slate-700">{job.targetStudents}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
          <Map className="w-4 h-4 text-orange-500" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">{t('states')}</p>
            <p className="text-sm font-bold text-slate-700">{job.states.join(', ')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
          <Clock className="w-4 h-4 text-purple-500" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">{t('age')}</p>
            <p className="text-sm font-bold text-slate-700">{job.ageRange}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-10">
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t('requirements')}
            </h5>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {job.requirements.map((req, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-slate-300 mt-2 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-2 text-slate-400">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{t('duration')}</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{job.duration}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-2 text-slate-400">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{t('workload')}</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{job.workload}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-3xl text-white">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{t('facilities')}</h5>
            <div className="flex flex-wrap gap-2">
              {job.facilities.map((fac, i) => (
                <span key={i} className="bg-white/10 text-white text-[10px] px-3 py-1.5 rounded-lg border border-white/5">
                  {fac}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">{t('salary')}</h5>
            <div className="text-2xl font-display font-bold text-blue-900">{job.salary}</div>
            <div className="flex items-center gap-2 mt-3 text-blue-600">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">{job.workingTime}</span>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-200">
        {t('applyNow')} <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

const TopJobCard: React.FC<{ job: Job, t: (key: string) => string, isSaved?: boolean, onToggleSave?: (e: React.MouseEvent) => void }> = ({ job, t, isSaved, onToggleSave }) => (
  <motion.div 
    whileHover={{ scale: 1.01 }}
    className="bg-white rounded-3xl border border-slate-200 flex flex-col md:flex-row overflow-hidden hover:shadow-2xl transition-all h-full relative"
  >
    <button 
      onClick={onToggleSave}
      className="absolute top-6 left-6 md:left-auto md:top-6 md:right-[100px] bg-white border border-slate-100 p-2 rounded-full hover:bg-slate-50 transition-colors shadow-sm z-10"
    >
      <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'fill-pink-500 text-pink-500' : 'text-slate-300 hover:text-pink-400'}`} />
    </button>
    <div className="p-8 pt-16 md:pt-8 flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
            {job.category}
          </span>
          <h3 className="text-2xl font-bold text-slate-900 pr-4">{job.name}</h3>
        </div>
        <div className="text-right ml-4">
          <div className="text-lg font-bold text-emerald-600">{job.salary}</div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{job.workingTime}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <Zap className="w-5 h-5 text-amber-500" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">{t('workload')}</p>
            <p className="text-sm font-bold text-slate-800">{job.workload}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <Gift className="w-5 h-5 text-indigo-500" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">{t('facilities')}</p>
            <p className="text-sm font-bold text-slate-800">{job.facilities.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <Clock className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">{t('duration')}</p>
            <p className="text-sm font-bold text-slate-800">{job.duration}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <Ruler className="w-5 h-5 text-slate-500" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">{t('yourHeight')}</p>
            <p className="text-sm font-bold text-slate-800">{job.minHeightMale}cm</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-wrap gap-2">
        {job.facilities.slice(0, 3).map((f, i) => (
          <span key={i} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            {f}
          </span>
        ))}
        {job.facilities.length > 3 && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">+ {job.facilities.length - 3} more</span>}
      </div>
    </div>
    
    <div className="bg-slate-50 p-6 flex items-center justify-center md:border-l border-slate-200">
      <button className="bg-slate-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all group shrink-0">
        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </motion.div>
);

interface StatItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value }) => {
  return (
    <div className="text-center group">
      <div className="mx-auto w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 mb-4 border border-white/10 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <div className="text-2xl font-display font-bold text-white mb-1">{value}</div>
      <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{label}</div>
    </div>
  );
};
