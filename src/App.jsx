import React, { useState, useEffect, useRef } from 'react';
import { socket } from './socket';
import axios from 'axios';
import { Routes, Route, Link, useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import {
  Ticket, Book, Users, ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  AlertCircle, CheckCircle2, Clock, UserCircle2, Menu, X, Home,
  MessageSquare, XCircle, Bot, Zap, Coffee, Search,
  ClipboardCheck, CheckCircle, Phone, Tablet, Monitor, Maximize2, Minimize2,
  AlertTriangle, Flame, Siren, HelpCircle, Play, GraduationCap, FileText, Download
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || (window.location.origin.includes('localhost') ? 'http://localhost:3001' : window.location.origin);

const SHIFT_DURATION_SEC = 600;

const SCENARIOS = {
  1: {
    title: "Tutorial: Learn the Ticket System",
    description: "This is a tutorial to learn how the ticket system works. No time limit. Follow the instructions in the PDF file."
  },
  2: {
    title: "Stage 2: Main Experiment",
    description: "In this stage you will work with AI assistant or colleagues depending on your group."
  }
};

// Determine help type for stage 2
const getStage2Description = (parity) => {
  if (parity === 'even') {
    return "In this stage you will work with AI assistant. You can use 'Ask AI' button to get advice on solving tickets.";
  } else {
    return "In this stage you will work in a team. You can delegate tickets to colleagues who will help you with solutions.";
  }
};

// --- TUTORIAL BRIEFING SCREEN ---
const TutorialBriefingScreen = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-cyan-500/30 text-center">
        <div className="flex items-center justify-center mb-4">
          <GraduationCap className="text-cyan-400" size={48} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Tutorial Introduction</h2>

        <div className="text-slate-300 mb-6 text-left space-y-3">
          <p className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>Now you will go through a tutorial to learn how the ticket system works.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>During the experiment, you can use the instruction manual at any time.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>The instruction button is available in the sidebar menu.</span>
          </p>
        </div>

        <div className="mb-6 p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-xl">
          <p className="text-sm text-cyan-200">
            <strong>Note:</strong> Take your time to understand the system. The tutorial has no time limit.
          </p>
        </div>

        <button
          onClick={onContinue}
          className="w-full bg-cyan-500 text-black py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest hover:bg-cyan-600 transition-colors text-sm sm:text-base min-h-[44px]"
        >
          Start Tutorial
        </button>
      </div>
    </div>
  );
};

// --- HTML INSTRUCTION VIEWER ---
const HtmlViewer = ({ onClose, isTutorialMode = false, onStartTutorial }) => {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef(null);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur flex flex-col items-center justify-center p-4">
      <div className="max-w-6xl w-full h-full flex flex-col bg-slate-900 rounded-2xl sm:rounded-[2rem] border border-cyan-500/30 overflow-hidden">
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-slate-900">
          <div className="flex items-center gap-3">
            <FileText className="text-cyan-400" size={24} />
            <h2 className="text-xl font-bold text-white">System Instructions</h2>
            {isTutorialMode && (
              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30">
                Tutorial Mode
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`${API_BASE_URL}/instructions.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600/30 border border-indigo-500/50 text-indigo-100 rounded-xl hover:bg-indigo-600 transition-colors text-sm"
            >
              <Download size={16} />
              Open in New Tab
            </a>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                <p className="text-slate-400">Loading instructions...</p>
              </div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={`${API_BASE_URL}/instructions.html`}
            className="w-full h-full"
            title="System Instructions"
            onLoad={handleIframeLoad}
            sandbox="allow-scripts allow-same-origin allow-forms"
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        </div>

        <div className="h-20 flex items-center justify-between px-6 border-t border-white/10 bg-slate-900">
          <div className="text-slate-400 text-sm">
            {isTutorialMode
              ? "Read the instructions before starting the tutorial"
              : "Instructions are available throughout the experiment"}
          </div>
          <div className="flex gap-3">
            {isTutorialMode && onStartTutorial ? (
              <>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-800 text-slate-300 rounded-xl border border-white/10 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onStartTutorial}
                  className="px-6 py-3 bg-cyan-500 text-black rounded-xl font-bold hover:bg-cyan-600 transition-colors"
                >
                  Start Tutorial
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-800 text-slate-300 rounded-xl border border-white/10 hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- UTILITY COMPONENTS ---

const ShiftTimer = ({ timeLeft, isTutorial }) => {
  if (isTutorial) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-sm sm:text-lg border bg-emerald-900/50 border-emerald-500 text-emerald-400">
        <GraduationCap size={18} />
        <span className="text-xs sm:text-base">Tutorial</span>
      </div>
    );
  }

  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm sm:text-lg border ${timeLeft < 60 ? 'bg-red-900/50 border-red-500 text-red-400 animate-pulse' : 'bg-slate-800 border-slate-700 text-cyan-400'}`}>
      <Clock size={18} />
      <span className="text-xs sm:text-base">{min.toString().padStart(2, '0')}:{sec.toString().padStart(2, '0')}</span>
    </div>
  );
};

const TicketTimer = ({ ticket }) => {
  const [remaining, setRemaining] = useState(0);
  const [label, setLabel] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      // For tutorial tickets, no timer
      if (ticket.isTutorial) {
        setLabel('Tutorial');
        return;
      }

      const now = Date.now();
      let target = 0;
      let type = '';

      if (ticket.status === 'not assigned') {
        target = ticket.deadlineAssign;
        type = 'Assign:';
      } else if (ticket.status === 'in Progress') {
        target = ticket.deadlineSolve;
        type = 'Solve:';
      } else {
        setLabel('Done');
        return;
      }

      const diff = Math.floor((target - now) / 1000);
      if (diff <= 0) {
        setRemaining(0);
        setIsOverdue(true);
        setLabel('Overdue');
      } else {
        setRemaining(diff);
        setIsOverdue(false);
        setLabel(type);
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [ticket]);

  if (ticket.status === 'solved') return <span className="text-green-400 text-[10px] font-bold">SOLVED</span>;

  // For tutorial tickets
  if (ticket.isTutorial) {
    return (
      <div className="text-[10px] font-mono font-bold flex flex-col items-end text-emerald-400">
        <span className="text-[8px] uppercase opacity-70">Tutorial</span>
        <span>No Time Limit</span>
      </div>
    );
  }

  const min = Math.floor(remaining / 60);
  const sec = remaining % 60;

  // Special styling for critical tickets
  if (ticket.isCritical) {
    return (
      <div className={`text-[10px] font-mono font-bold flex flex-col items-end ${isOverdue ? 'text-red-500 animate-pulse' : 'text-amber-400 font-bold'}`}>
        <span className="text-[8px] uppercase opacity-70 flex items-center gap-1">
          <AlertTriangle size={8} /> {label}
        </span>
        <span className="text-amber-300">{min}:{sec.toString().padStart(2, '0')}</span>
      </div>
    );
  }

  return (
    <div className={`text-[10px] font-mono font-bold flex flex-col items-end ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
      <span className="text-[8px] uppercase opacity-70">{label}</span>
      <span>{min}:{sec.toString().padStart(2, '0')}</span>
    </div>
  );
};

// --- AI MODE SELECTOR ---
const AIModeSelector = ({ aiMode, setAiMode, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-indigo-500/30 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2"><Bot size={20} /> AI Mode Selection</h2>

        <div className="space-y-4 mb-8">
          <div>
            <p className="text-slate-400 mb-4 text-sm">Select AI work mode for this shift:</p>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setAiMode('normal')}
                className={`p-4 rounded-xl border text-left transition-all ${aiMode === 'normal' ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:border-indigo-500/30'}`}
              >
                <div className="font-bold mb-1 text-base">Normal Mode</div>
                <div className="text-sm text-slate-300">AI gives advice on request. You solve tickets yourself, AI helps with solution search.</div>
              </button>

              <button
                onClick={() => setAiMode('autonomous')}
                className={`p-4 rounded-xl border text-left transition-all ${aiMode === 'autonomous' ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:border-indigo-500/30'}`}
              >
                <div className="font-bold mb-1 text-base">Autonomous Mode</div>
                <div className="text-sm text-slate-300">AI solves tickets independently. May skip some tickets or solve them incorrectly.</div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl border border-white/5 hover:bg-slate-700 transition-colors text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-base"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// --- SURVEY COMPONENT ---
const SurveyScreen = ({ questions, onComplete, title, description }) => {
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});

  const handleAnswerChange = (questionId, answer) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Clear error for this question
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: null
      }));
    }
  };

  const validateResponses = () => {
    const newErrors = {};

    questions.forEach(question => {
      if (question.required && (!responses[question.id] || responses[question.id].trim() === '')) {
        newErrors[question.id] = 'This is a required question';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateResponses()) {
      const formattedResponses = questions.map(question => ({
        questionId: question.id,
        questionText: question.question,
        answer: responses[question.id] || 'Not specified'
      }));

      onComplete(formattedResponses);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-2xl w-full bg-slate-900 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-indigo-500/30">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <ClipboardCheck className="text-indigo-400" size={24} />
          <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
        </div>

        <p className="text-slate-400 mb-6 sm:mb-8 text-sm">
          {description}
        </p>

        <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-10 max-h-[50vh] sm:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-slate-800/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/5">
              <div className="flex items-start mb-3 sm:mb-4">
                <span className="flex items-center justify-center w-6 h-6 bg-indigo-500 rounded-full text-xs font-bold mr-3">
                  {index + 1}
                </span>
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  {question.question}
                  {question.required && <span className="text-rose-500 ml-1">*</span>}
                </h3>
              </div>

              {question.type === 'multiple' ? (
                <div className="grid grid-cols-1 gap-2">
                  {question.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerChange(question.id, option)}
                      className={`p-3 text-left rounded-xl border transition-all text-sm sm:text-base min-h-[44px] ${responses[question.id] === option
                        ? 'bg-indigo-600/30 border-indigo-500 text-white'
                        : 'bg-slate-800/50 border-white/5 text-slate-400 hover:border-indigo-500/30'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  value={responses[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder={question.placeholder || "Enter your answer..."}
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500/50 resize-none text-base"
                  rows={3}
                />
              )}

              {errors[question.id] && (
                <div className="mt-2 text-rose-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors[question.id]}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-wider hover:bg-indigo-700 transition-colors text-sm sm:text-base min-h-[44px]"
          >
            Complete Survey
          </button>
        </div>

        <div className="mt-6 text-xs text-slate-500 text-center">
          <p>* Required questions</p>
          <p>All answers are saved anonymously and used only for scientific purposes</p>
        </div>
      </div>
    </div>
  );
};

// --- MOBILE BOTTOM NAVIGATION ---
const MobileBottomNav = ({ activeRoute, navigate }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-white/10 backdrop-blur-md z-40">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => navigate('/tickets')}
          className={`flex flex-col items-center justify-center p-2 rounded-lg ${activeRoute === '/tickets' ? 'text-cyan-400' : 'text-slate-400'}`}
        >
          <Ticket size={20} />
          <span className="text-[10px] mt-1">Tickets</span>
        </button>

        <button
          onClick={() => navigate('/kb')}
          className={`flex flex-col items-center justify-center p-2 rounded-lg ${activeRoute.includes('/kb') ? 'text-amber-400' : 'text-slate-400'}`}
        >
          <Book size={20} />
          <span className="text-[10px] mt-1">KB</span>
        </button>

        <button
          onClick={() => navigate('/agents')}
          className={`flex flex-col items-center justify-center p-2 rounded-lg ${activeRoute === '/agents' ? 'text-indigo-400' : 'text-slate-400'}`}
        >
          <Users size={20} />
          <span className="text-[10px] mt-1">Team</span>
        </button>

        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center p-2 rounded-lg ${activeRoute === '/' ? 'text-green-400' : 'text-slate-400'}`}
        >
          <Home size={20} />
          <span className="text-[10px] mt-1">Home</span>
        </button>
      </div>
    </div>
  );
};

// --- PAGES ---

const TicketsPage = ({ tickets, socket, navigate, currentStage }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = tickets.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Ticket className="text-cyan-400" size={20} />
          Ticket Queue
          {currentStage === 1 && (
            <span className="ml-2 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
              Tutorial
            </span>
          )}
        </h2>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <Ticket size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">No tickets found</p>
            <p className="text-sm mt-1">{searchTerm ? 'Try different search terms' : 'New tickets will appear soon'}</p>
          </div>
        ) : (
          filteredTickets.map(t => (
            <div
              key={t.id}
              onClick={() => navigate(`/tickets/${t.id}`)}
              className={`group p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer active:scale-[0.98] touch-manipulation
                ${t.isCritical
                  ? 'bg-gradient-to-r from-red-900/40 to-amber-900/30 border-red-500/60 hover:border-red-400 shadow-lg shadow-red-900/20 animate-pulse-subtle'
                  : t.isTutorial
                    ? 'bg-gradient-to-r from-emerald-900/20 to-teal-900/10 border-emerald-500/40 hover:border-emerald-400'
                    : 'bg-slate-800/40 border-white/5 hover:border-white/20'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <div className={`text-[10px] font-bold mb-1 tracking-widest uppercase flex items-center gap-1 ${t.isCritical ? 'text-red-300' : t.isTutorial ? 'text-emerald-300' : 'text-slate-500'}`}>
                    {t.isCritical && <Flame size={10} className="text-amber-400" />}
                    {t.isTutorial && <GraduationCap size={10} className="text-emerald-400" />}
                    #{t.id.slice(0, 5)}
                    {t.isCritical && <span className="ml-1 px-2 py-0.5 bg-gradient-to-r from-red-500 to-amber-500 text-white rounded-full text-[8px]">CRITICAL</span>}
                    {t.isTutorial && <span className="ml-1 px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-[8px]">TUTORIAL</span>}
                  </div>
                  <h4 className={`font-bold group-hover:text-cyan-400 transition-colors text-sm truncate flex items-center gap-1 ${t.isCritical ? 'text-white' : t.isTutorial ? 'text-emerald-100' : 'text-white'}`}>
                    {t.isCritical && <Siren size={14} className="text-red-400 animate-pulse flex-shrink-0" />}
                    {t.isTutorial && <HelpCircle size={14} className="text-emerald-400 flex-shrink-0" />}
                    {t.title}
                  </h4>
                  <p className={`text-xs mt-1 line-clamp-1 ${t.isCritical ? 'text-red-200' : t.isTutorial ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {t.isCritical && <span className="font-bold text-amber-300">🚨 URGENT: </span>}
                    {t.isTutorial && <span className="font-bold text-emerald-300">📚 TUTORIAL: </span>}
                    {t.description}
                  </p>
                </div>
                <TicketTimer ticket={t} />
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                <div onClick={(e) => e.stopPropagation()}>
                  <select
                    value={t.status}
                    onChange={(e) => socket.emit('ticket:status:update', { ticketId: t.id, newStatus: e.target.value })}
                    className={`text-[10px] font-bold uppercase p-1.5 rounded-lg border bg-slate-900 outline-none min-h-[32px] 
                      ${t.isCritical
                        ? 'border-red-500 text-red-300 bg-red-900/40'
                        : t.isTutorial
                          ? 'border-emerald-500 text-emerald-300 bg-emerald-900/20'
                          : t.status === 'in Progress'
                            ? 'border-cyan-500 text-cyan-400'
                            : 'border-slate-700 text-slate-500'}`}
                  >
                    <option value="not assigned">Free</option>
                    <option value="in Progress">In Progress</option>
                    <option value="solved">Solved</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  {t.assignedTo && <span className={`text-[10px] bg-slate-800 px-2 py-1 rounded-full max-w-[100px] truncate ${t.isCritical ? 'text-amber-300 bg-red-900/40' : t.isTutorial ? 'text-emerald-300 bg-emerald-900/40' : 'text-slate-400'}`}>{t.assignedTo}</span>}
                  {t.severity === 'critical' && <AlertCircle size={16} className="text-red-400 animate-pulse flex-shrink-0" />}
                  {t.solutionAuthor === 'AI' && <Bot size={14} className="text-indigo-400 flex-shrink-0" />}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const TicketDetailPage = ({ tickets, kb, agents, socket, navigate, areAgentsOnline, currentStage, aiMode, participantParity }) => {
  const { id } = useParams();
  const ticket = tickets.find(t => t.id === id);
  const [sol, setSol] = useState('');
  const [kbid, setKbid] = useState('');
  const [aiAdvice, setAiAdvice] = useState(null);
  const [showDelegationPanel, setShowDelegationPanel] = useState(false);

  useEffect(() => {
    setAiAdvice(null);
    socket.on('ai:response', (data) => {
      console.log(`🤖 Received AI response for ticket ${data.ticketId}:`, data.text.substring(0, 50));
      if (data.ticketId === id) setAiAdvice(data);
    });
    return () => socket.off('ai:response');
  }, [id, socket]);

  if (!ticket) return <div className="p-6 sm:p-10 text-white italic">Ticket not found...</div>;
  const isMyTicket = ticket.assignedTo === 'participant';

  // Show AI only at stage 2 for even participants in normal mode
  const showAI = currentStage === 2 && participantParity === 'even' && aiMode === 'normal';
  // Show delegation only at stage 2 for odd participants
  const showDelegation = currentStage === 2 && participantParity === 'odd';

  const handleAskAI = () => {
    console.log(`🤖 Asking AI for ticket ${ticket.id}`);
    socket.emit('ai:ask', { ticketId: ticket.id });
  };

  const handleDelegate = (botId) => {
    console.log(`👥 Delegating ticket ${ticket.id} to bot ${botId}`);
    socket.emit('bot:delegate', { ticketId: ticket.id, botId });
    setShowDelegationPanel(false);
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 overflow-hidden pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
        <button onClick={() => navigate('/tickets')} className="text-slate-400 flex items-center gap-1 hover:text-white transition-colors w-max">
          <ChevronLeft size={20} /> <span className="text-sm sm:text-base">Back</span>
        </button>
        <div className="flex items-center gap-3 sm:gap-4">
          <TicketTimer ticket={ticket} />
          <div className={`p-2 px-3 sm:px-4 rounded-xl sm:rounded-2xl border flex items-center gap-2 ${ticket.isCritical ? 'bg-gradient-to-r from-red-900/40 to-amber-900/30 border-red-500/60' : ticket.isTutorial ? 'bg-gradient-to-r from-emerald-900/20 to-teal-900/10 border-emerald-500/40' : 'bg-white/5 border-white/10'}`}>
            <span className="text-[10px] uppercase text-slate-500">Assignee:</span>
            <span className="text-xs font-bold text-white truncate max-w-[80px] sm:max-w-none">{ticket.assignedTo || 'None'}</span>
            {ticket.solutionAuthor === 'AI' && <Bot size={12} className="text-indigo-400 ml-2 flex-shrink-0" />}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 overflow-hidden">
        <div className={`flex-1 rounded-xl sm:rounded-[2rem] p-4 sm:p-8 flex flex-col border transition-all 
          ${ticket.isCritical
            ? 'bg-gradient-to-br from-red-950/40 to-amber-950/20 border-red-500/60 shadow-lg shadow-red-900/20'
            : ticket.isTutorial
              ? 'bg-gradient-to-br from-emerald-950/30 to-teal-950/20 border-emerald-500/40 shadow-lg shadow-emerald-900/20'
              : (isMyTicket ? 'bg-white/[0.03] border-white/10' : 'bg-slate-950/50 border-dashed border-slate-800')}`}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight break-words flex items-center gap-2">
              {ticket.isCritical && <div className="flex items-center gap-2">
                <Siren className="text-red-400 animate-pulse" size={24} />
                <span className="text-red-300">🚨 CRITICAL</span>
              </div>}
              {ticket.isTutorial && <div className="flex items-center gap-2">
                <GraduationCap className="text-emerald-400" size={24} />
                <span className="text-emerald-300">📚 TUTORIAL</span>
              </div>}
              <span className={ticket.isCritical ? 'text-white' : ticket.isTutorial ? 'text-emerald-100' : 'text-white'}>{ticket.title}</span>
            </h2>
            <div className="flex gap-2">
              {showAI && (
                <button
                  onClick={handleAskAI}
                  className={`flex items-center gap-2 border hover:scale-105 transition-all px-3 sm:px-4 py-2 rounded-xl text-xs font-bold min-h-[40px]
                    ${ticket.isCritical
                      ? 'bg-gradient-to-r from-amber-600/40 to-red-600/40 border-amber-500/50 text-amber-100 hover:bg-amber-600'
                      : ticket.isTutorial
                        ? 'bg-gradient-to-r from-emerald-600/40 to-teal-600/40 border-emerald-500/50 text-emerald-100 hover:bg-emerald-600'
                        : 'bg-indigo-600/30 border-indigo-500/50 text-indigo-100 hover:bg-indigo-600'}`}
                >
                  <Zap size={14} className={aiAdvice ? "text-yellow-400" : "text-white"} /> <span className="hidden sm:inline">Ask AI</span>
                </button>
              )}
              {showDelegation && (
                <button
                  onClick={() => setShowDelegationPanel(!showDelegationPanel)}
                  className="md:hidden flex items-center gap-2 bg-amber-600/30 border border-amber-500/50 hover:bg-amber-600 text-amber-100 px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px]"
                >
                  <Users size={14} /> <span>Team</span>
                </button>
              )}
            </div>
          </div>

          <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-5 mb-4 sm:mb-6 text-sm sm:text-base
            ${ticket.isCritical
              ? 'bg-gradient-to-r from-red-900/30 to-amber-900/20 border border-red-500/30 text-red-100'
              : ticket.isTutorial
                ? 'bg-gradient-to-r from-emerald-900/20 to-teal-900/10 border border-emerald-500/20 text-emerald-100'
                : 'bg-black/20 text-slate-300'}`}>
            {ticket.description}
            {ticket.isTutorial && (
              <div className="mt-3 p-3 bg-emerald-900/30 rounded-lg border border-emerald-500/20">
                <p className="text-emerald-200 text-sm"><strong>Tutorial Tip:</strong> Try to solve this ticket by assigning it to yourself, finding a solution, and completing it.</p>
              </div>
            )}
          </div>

          <div className={`mb-4 sm:mb-6 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-3 max-h-40 sm:max-h-60 overflow-y-auto
            ${ticket.isCritical
              ? 'bg-gradient-to-b from-red-900/20 to-transparent border border-red-500/20'
              : ticket.isTutorial
                ? 'bg-gradient-to-b from-emerald-900/20 to-transparent border border-emerald-500/20'
                : 'bg-black/20'}`}>
            {(ticket.messages || []).map((m, i) => (
              <div
                key={i}
                className={`p-2 sm:p-3 rounded-xl text-xs sm:text-sm
                  ${m.from === 'client'
                    ? ticket.isCritical
                      ? 'bg-gradient-to-r from-rose-900/40 to-red-900/30 text-rose-200 border border-rose-500/30'
                      : ticket.isTutorial
                        ? 'bg-gradient-to-r from-emerald-900/30 to-teal-900/20 text-emerald-200 border border-emerald-500/30'
                        : 'bg-rose-900/30 text-rose-200'
                    : m.from === 'agent'
                      ? ticket.isCritical
                        ? 'bg-gradient-to-r from-cyan-900/40 to-teal-900/30 text-cyan-200 border border-cyan-500/30'
                        : ticket.isTutorial
                          ? 'bg-gradient-to-r from-cyan-900/30 to-teal-900/20 text-cyan-200 border border-cyan-500/30'
                          : 'bg-cyan-900/30 text-cyan-200'
                      : m.from === 'system'
                        ? 'bg-gradient-to-r from-red-900/50 to-amber-900/40 text-red-100 border border-red-500/50 text-center font-bold'
                        : m.from === 'AI'
                          ? ticket.isCritical
                            ? 'bg-gradient-to-r from-indigo-900/40 to-purple-900/30 text-indigo-200 border border-indigo-500/30'
                            : ticket.isTutorial
                              ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/20 text-indigo-200 border border-indigo-500/30'
                              : 'bg-indigo-900/30 text-indigo-200'
                          : 'bg-slate-700/40 text-slate-300'
                  }`}
              >
                <div className="text-[10px] uppercase opacity-60 mb-1">
                  {m.from} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div>{m.text}</div>
              </div>
            ))}
          </div>

          {aiAdvice && (
            <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl animate-in slide-in-from-top-2 border
              ${ticket.isCritical
                ? 'bg-gradient-to-r from-amber-900/30 to-red-900/20 border-amber-500/40'
                : ticket.isTutorial
                  ? 'bg-gradient-to-r from-emerald-900/20 to-teal-900/10 border-emerald-500/30'
                  : 'bg-indigo-900/20 border-indigo-500/30'}`}>
              <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase">
                <Bot size={14} className={ticket.isCritical ? "text-amber-300" : ticket.isTutorial ? "text-emerald-300" : "text-indigo-300"} />
                <span className={ticket.isCritical ? "text-amber-300" : ticket.isTutorial ? "text-emerald-300" : "text-indigo-300"}>AI Advice:</span>
              </div>
              <p className={`text-sm italic ${ticket.isCritical ? 'text-amber-100' : ticket.isTutorial ? 'text-emerald-100' : 'text-indigo-100'}`}>"{aiAdvice.text}"</p>
              {aiAdvice.kbId && <button onClick={() => setKbid(aiAdvice.kbId)} className={`text-[10px] underline mt-1 ${ticket.isCritical ? 'text-amber-400' : ticket.isTutorial ? 'text-emerald-400' : 'text-indigo-400'}`}>Attach this article</button>}
            </div>
          )}

          {isMyTicket ? (
            <div className="flex-1 flex flex-col">
              <textarea
                value={sol}
                onChange={e => setSol(e.target.value)}
                className={`flex-1 border rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white mb-4 sm:mb-6 outline-none resize-none text-base
                  ${ticket.isCritical
                    ? 'bg-gradient-to-b from-red-900/20 to-black/40 border-red-500/40 focus:border-amber-500/60 placeholder:text-red-300/50'
                    : ticket.isTutorial
                      ? 'bg-gradient-to-b from-emerald-900/20 to-black/40 border-emerald-500/40 focus:border-emerald-500/60 placeholder:text-emerald-300/50'
                      : 'bg-black/40 border-white/10 focus:border-cyan-500/50 placeholder:text-slate-500'}`}
                placeholder={ticket.isCritical ? "🚨 Enter URGENT solution..." : ticket.isTutorial ? "📚 Enter solution for tutorial..." : "Enter solution..."}
                rows={4}
              />
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <select
                  value={kbid}
                  onChange={e => setKbid(e.target.value)}
                  className={`flex-1 border rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white text-sm outline-none min-h-[44px]
                    ${ticket.isCritical
                      ? 'bg-gradient-to-r from-red-900/20 to-amber-900/10 border-red-500/40'
                      : ticket.isTutorial
                        ? 'bg-gradient-to-r from-emerald-900/20 to-teal-900/10 border-emerald-500/40'
                        : 'bg-slate-800 border-white/10'}`}
                >
                  <option value="">Attach article...</option>
                  {kb.map(k => <option key={k.id} value={k.id}>{k.title}</option>)}
                </select>
                <button
                  onClick={() => {
                    socket.emit('ticket:solve', { ticketId: ticket.id, solution: sol, linkedKbId: kbid });
                    setSol('');
                    setKbid('');
                    navigate('/tickets');
                  }}
                  className={`px-6 sm:px-10 uppercase text-xs sm:text-sm rounded-xl sm:rounded-2xl hover:scale-[1.02] transition-all min-h-[44px] py-3 font-bold
                    ${ticket.isCritical
                      ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white hover:from-amber-600 hover:to-red-700 shadow-lg shadow-red-900/30'
                      : ticket.isTutorial
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-900/30'
                        : 'bg-cyan-500 text-black hover:bg-cyan-600'}`}
                >
                  {ticket.isCritical ? '🚨 COMPLETE URGENTLY' : ticket.isTutorial ? '📚 COMPLETE TUTORIAL' : 'Complete'}
                </button>
              </div>
            </div>
          ) : (
            <div className={`flex-1 flex items-center justify-center italic p-4 text-center rounded-xl sm:rounded-2xl
              ${ticket.isCritical
                ? 'bg-gradient-to-r from-red-900/20 to-transparent border border-red-500/30 text-amber-200'
                : ticket.isTutorial
                  ? 'bg-gradient-to-r from-emerald-900/20 to-transparent border border-emerald-500/30 text-emerald-200'
                  : 'text-slate-500'}`}>
              {ticket.isCritical
                ? '🚨 ASSIGN THIS CRITICAL TICKET (status "In Progress") TO SOLVE IMMEDIATELY!'
                : ticket.isTutorial
                  ? '📚 Assign this tutorial ticket to yourself (status "In Progress") to solve it.'
                  : 'Assign ticket to yourself (status "In Progress") to solve it.'}
            </div>
          )}
        </div>

        {showDelegation && (
          <>
            {/* Mobile Delegation Panel */}
            {showDelegationPanel && (
              <div className="md:hidden fixed inset-0 z-40 bg-black/90 backdrop-blur flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                  <h3 className="font-bold text-white text-lg">Delegate to Team</h3>
                  <button onClick={() => setShowDelegationPanel(false)} className="text-slate-400">
                    <X size={24} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid grid-cols-1 gap-3">
                    {agents.map(a => {
                      const isOnline = a.status === 'online';
                      return (
                        <button
                          key={a.id}
                          disabled={!areAgentsOnline || !isMyTicket || !isOnline}
                          onClick={() => handleDelegate(a.id)}
                          className={`flex items-center gap-3 p-4 rounded-xl border text-sm transition-all min-h-[60px] 
                          ${areAgentsOnline && isMyTicket && isOnline
                              ? ticket.isCritical
                                ? 'bg-gradient-to-r from-amber-600/30 to-red-600/20 border-amber-500/40 text-white hover:from-amber-700 hover:to-red-600'
                                : 'bg-indigo-600/20 border-indigo-500/30 text-white hover:bg-indigo-600'
                              : 'bg-black/20 border-white/5 opacity-50 cursor-not-allowed text-slate-500'}`}
                        >
                          <div className={`w-10 h-10 rounded flex items-center justify-center ${isOnline ? 'bg-indigo-500' : 'bg-amber-600'}`}>
                            <span className="font-bold">{a.name[0]}</span>
                          </div>
                          <div className="flex flex-col items-start flex-1">
                            <span className="font-medium">{a.name}</span>
                            <span className={`text-xs ${isOnline ? 'text-green-500' : 'text-amber-500'}`}>
                              {isOnline ? 'Online • Available' : 'Away • Busy'}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Delegation Panel */}
            <aside className="hidden lg:flex w-80 flex-col gap-6">
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                <h3 className="font-bold text-slate-400 mb-4 text-sm uppercase">Delegation</h3>
                <div className="grid grid-cols-1 gap-2">
                  {agents.map(a => {
                    const isOnline = a.status === 'online';
                    return (
                      <button
                        key={a.id}
                        disabled={!areAgentsOnline || !isMyTicket || !isOnline}
                        onClick={() => handleDelegate(a.id)}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-[10px] font-bold transition-all min-h-[44px]
                        ${areAgentsOnline && isMyTicket && isOnline
                            ? ticket.isCritical
                              ? 'bg-gradient-to-r from-amber-600/30 to-red-600/20 border-amber-500/40 text-white hover:from-amber-700 hover:to-red-600'
                              : 'bg-indigo-600/20 border-indigo-500/30 text-white hover:bg-indigo-600'
                            : 'bg-black/20 border-white/5 opacity-50 cursor-not-allowed text-slate-500'}`}
                      >
                        <div className={`w-8 h-8 rounded flex items-center justify-center ${isOnline ? 'bg-indigo-500' : 'bg-amber-600'}`}>
                          {a.name[0]}
                        </div>
                        <div className="flex flex-col items-start">
                          <span>{a.name}</span>
                          {!isOnline && <span className="text-[8px] text-amber-500 uppercase">Away</span>}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
};

const KBListPage = ({ kb, navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredKb = kb.filter(k =>
    k.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 h-full flex flex-col pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-0 flex items-center gap-2">
          <Book className="text-amber-400" size={20} />
          Knowledge Base
        </h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 overflow-y-auto pr-1 custom-scrollbar">
        {filteredKb.map(k => (
          <div key={k.id} onClick={() => navigate(`/kb/${k.id}`)}
            className="p-4 sm:p-6 bg-white/5 border border-white/5 rounded-xl sm:rounded-3xl hover:bg-white/10 hover:border-amber-400/30 transition-all cursor-pointer active:scale-[0.98] touch-manipulation group">
            <h4 className="font-bold text-cyan-400 mb-2 group-hover:text-amber-400 transition-colors text-sm sm:text-base line-clamp-2">{k.title}</h4>
            <p className="text-xs text-slate-400 line-clamp-3 mb-3">{k.content}</p>
            <div className="text-[10px] text-slate-600 font-mono">ID: {k.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const KBDetailPage = ({ kb, navigate }) => {
  const { id } = useParams();
  const article = kb.find(k => k.id === id);
  if (!article) return <div className="p-6 sm:p-10 text-white">Article not found</div>;
  return (
    <div className="p-4 sm:p-8 h-full flex flex-col pb-20 md:pb-0">
      <button onClick={() => navigate('/kb')} className="mb-4 sm:mb-6 text-slate-400 flex items-center gap-1 hover:text-white transition-colors w-max text-sm sm:text-base">
        <ChevronLeft size={20} /> <span>Back to Articles</span>
      </button>
      <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 max-w-4xl">
        <div className="text-xs font-mono text-amber-500 mb-2">{article.id}</div>
        <h1 className="text-xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">{article.title}</h1>
        <div className="h-1 w-16 sm:w-20 bg-amber-500/50 rounded-full mb-6 sm:mb-8"></div>
        <p className="text-sm sm:text-lg text-slate-300 leading-relaxed whitespace-pre-line">{article.content}</p>
      </div>
    </div>
  );
};

const SummaryScreen = ({ tickets, onNext, isLastStage, participantParity, stageTicketsStats }) => {
  // Используем переданную статистику или вычисляем из текущих тикетов
  const stats = stageTicketsStats || (() => {
    const total = tickets.length;
    const solvedMe = tickets.filter(t => t.status === 'solved' && t.solutionAuthor === 'participant').length;
    const solvedOthers = tickets.filter(t => t.status === 'solved' && t.solutionAuthor !== 'participant' && t.solutionAuthor !== 'AI').length;
    const solvedAI = tickets.filter(t => t.status === 'solved' && t.solutionAuthor === 'AI').length;
    const missedAssign = tickets.filter(t => t.status === 'not assigned').length;
    const unsolved = tickets.filter(t => t.status === 'in Progress').length;
    const criticalTickets = tickets.filter(t => t.isCritical).length;
    const criticalSolved = tickets.filter(t => t.isCritical && t.status === 'solved').length;
    
    return {
      total, solvedMe, solvedOthers, solvedAI, missedAssign, unsolved, criticalTickets, criticalSolved
    };
  })();

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-900 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-white/10 text-center">
        <h2 className="text-xl sm:text-3xl font-bold mb-6 text-white">Shift Results</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/5">
            <div className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">{stats.total}</div>
            <div className="text-[10px] sm:text-xs text-slate-500 uppercase font-black">Total Tickets</div>
          </div>
          <div className="p-3 sm:p-4 bg-cyan-900/20 rounded-xl sm:rounded-2xl border border-cyan-500/30">
            <div className="text-2xl sm:text-4xl font-bold text-cyan-400 mb-1 sm:mb-2">{stats.solvedMe}</div>
            <div className="text-[10px] sm:text-xs text-cyan-200 uppercase font-black">Solved by Me</div>
          </div>
          {stats.criticalTickets > 0 && (
            <div className="p-3 sm:p-4 bg-gradient-to-r from-red-900/30 to-amber-900/20 rounded-xl sm:rounded-2xl border border-red-500/30">
              <div className="text-2xl sm:text-4xl font-bold text-amber-400 mb-1 sm:mb-2">{stats.criticalTickets}</div>
              <div className="text-[10px] sm:text-xs text-amber-200 uppercase font-black">Critical Tickets</div>
              <div className="text-[8px] text-amber-400 mt-1">{stats.criticalSolved}/{stats.criticalTickets} resolved</div>
            </div>
          )}
          {participantParity === 'even' ? (
            <div className="col-span-2 sm:col-span-1 p-3 sm:p-4 bg-indigo-900/20 rounded-xl sm:rounded-2xl border border-indigo-500/30">
              <div className="text-2xl sm:text-4xl font-bold text-indigo-400 mb-1 sm:mb-2">{stats.solvedAI}</div>
              <div className="text-[10px] sm:text-xs text-indigo-200 uppercase font-black">Solved with AI</div>
            </div>
          ) : (
            <div className="col-span-2 sm:col-span-1 p-3 sm:p-4 bg-amber-900/20 rounded-xl sm:rounded-2xl border border-amber-500/30">
              <div className="text-2xl sm:text-4xl font-bold text-amber-400 mb-1 sm:mb-2">{stats.solvedOthers}</div>
              <div className="text-[10px] sm:text-xs text-amber-200 uppercase font-black">Solved by Colleagues</div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-8 mb-6 sm:mb-10 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-2"><span className="w-2 h-2 sm:w-3 sm:h-3 bg-rose-500 rounded-full"></span> Not assigned: {stats.missedAssign}</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 sm:w-3 sm:h-3 bg-amber-500 rounded-full"></span> In progress: {stats.unsolved}</div>
          {stats.criticalTickets > 0 && (
            <div className="flex items-center gap-2"><span className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></span> Critical: {stats.criticalTickets}</div>
          )}
          {participantParity === 'odd' && (
            <div className="flex items-center gap-2"><span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></span> Solved by colleagues: {stats.solvedOthers}</div>
          )}
        </div>

        <button onClick={onNext} className="w-full bg-white text-black py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors text-sm sm:text-base min-h-[44px]">
          {isLastStage ? "Complete Experiment" : "Next Stage"}
        </button>
      </div>
    </div>
  );
};

// --- EXPERIMENT COMPLETION SCREEN ---
const ExperimentCompleteScreen = ({ onSurveyComplete }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-900 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-white/10 text-center">
        <div className="flex justify-center mb-4 sm:mb-6">
          <CheckCircle className="text-green-400" size={isMobile ? 48 : 64} />
        </div>
        <h2 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-8 text-white">Experiment Completed!</h2>

        <p className="text-slate-400 mb-4 sm:mb-8 text-sm sm:text-base">
          Thank you for participating in the experiment! Please answer a few final questions
          that will help us analyze the research results.
        </p>

        <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-indigo-900/20 rounded-xl sm:rounded-2xl border border-indigo-500/30">
          <p className="text-slate-300 text-sm sm:text-base">
            Your answers will help us understand how effective different approaches to solving technical problems are.
          </p>
        </div>

        <button
          onClick={onSurveyComplete}
          className="w-full bg-indigo-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors text-sm sm:text-base min-h-[44px]"
        >
          Take Final Survey
        </button>

        <div className="mt-4 sm:mt-6 text-xs text-slate-500">
          <p>All answers are saved anonymously and used only for scientific purposes</p>
        </div>
      </div>
    </div>
  );
};

// --- FINISH TUTORIAL BUTTON ---
const FinishTutorialButton = ({ onFinish }) => {
  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-8 md:right-8">
      <button
        onClick={onFinish}
        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/50 hover:scale-105 transition-all"
      >
        <GraduationCap size={20} />
        <span className="text-sm">Finish Tutorial</span>
      </button>
    </div>
  );
};

// --- FINAL SCREEN WITH RESET BUTTON ---
const FinalScreen = ({ onReset }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-900 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-white/10 text-center">
        <div className="flex justify-center mb-4 sm:mb-6">
          <CheckCircle className="text-green-400" size={isMobile ? 48 : 64} />
        </div>
        <h2 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-8 text-white">
          Experiment Completed
        </h2>

        <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-emerald-900/20 rounded-xl sm:rounded-2xl border border-emerald-500/30">
          <div className="text-lg sm:text-xl font-bold text-emerald-300 mb-2">
            Thank you for your participation!
          </div>
          <p className="text-slate-300 text-sm sm:text-base">
            Your answers and experiment results have been successfully saved and will be used for scientific research.
          </p>
        </div>

        <div className="text-slate-400 text-sm mb-6 sm:mb-8">
          <p>You can close this tab. All data is already saved.</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors text-sm sm:text-base min-h-[44px]"
          >
            Start New Experiment
          </button>

          <button
            onClick={onReset}
            className="w-full bg-rose-600/80 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-700 transition-colors text-sm sm:text-base min-h-[44px] border border-rose-500/30"
          >
            Clear All Data
          </button>
        </div>

        <div className="mt-6 text-xs text-slate-500">
          <p>Starting a new experiment will generate a new participant ID and clear all local data.</p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APPLICATION ---

export default function App() {
  const [appState, setAppState] = useState('INTRO');
  const [currentStageIndex, setCurrentStageIndex] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [participantId, setParticipantId] = useState('');
  const [participantParity, setParticipantParity] = useState(null);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [surveyType, setSurveyType] = useState(null); // 'pre-experiment' or 'post-experiment'
  const [showTutorialBriefing, setShowTutorialBriefing] = useState(false);
  const [showHtmlViewer, setShowHtmlViewer] = useState(false);
  const [htmlViewerMode, setHtmlViewerMode] = useState('reference'); // 'tutorial' or 'reference'

  const [tickets, setTickets] = useState([]);
  const [kb, setKb] = useState([]);
  const [agents, setAgents] = useState([]);
  const [toasts, setToasts] = useState([]);

  const [aiMode, setAiMode] = useState('normal');
  const [showAIModeSelector, setShowAIModeSelector] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // НОВОЕ: Сохраняем статистику по этапам
  const [stageStats, setStageStats] = useState({
    1: null, // статистика для туториала
    2: null  // статистика для второго этапа
  });

  // Используем ref для хранения текущей стадии, чтобы иметь доступ к актуальному значению внутри замыканий
  const currentStageRef = useRef(1);

  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Determine if bots are active (only at stage 2 for odd participants)
  const areAgentsOnline = currentStageIndex === 2 && participantParity === 'odd';

  // Синхронизация ref с state
  useEffect(() => {
    currentStageRef.current = currentStageIndex;
  }, [currentStageIndex]);

  // Восстановление состояния при загрузке
  useEffect(() => {
    // Проверяем, был ли завершен туториал в этой сессии
    const tutorialCompleted = sessionStorage.getItem('tutorialCompleted');
    const savedStage = sessionStorage.getItem('currentStage');
    const savedParticipantId = sessionStorage.getItem('participantId');
    const savedParity = sessionStorage.getItem('participantParity');

    if (tutorialCompleted === 'true' && savedStage === '2' &&
      savedParticipantId && savedParity) {
      console.log('🔄 Restoring previous tutorial state...');

      // Восстанавливаем состояние из sessionStorage
      setParticipantId(savedParticipantId);
      setParticipantParity(savedParity);
      setCurrentStageIndex(2);
      setAppState('BRIEFING');

      // Очищаем временные данные
      sessionStorage.removeItem('tutorialCompleted');
      sessionStorage.removeItem('currentStage');
    }
  }, []);

  // Generate participant ID and determine parity on initial load
  useEffect(() => {
    // Генерируем новый ID при каждом запуске приложения
    const id = 'P_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    setParticipantId(id);

    // Determine participant parity by last digit of ID
    const lastChar = id.charAt(id.length - 1);
    const isEven = !isNaN(lastChar) ? parseInt(lastChar) % 2 === 0 : Math.random() > 0.5;
    const parity = isEven ? 'even' : 'odd';
    setParticipantParity(parity);

    console.log(`Participant ID: ${id}, Parity: ${parity}`);

    // Load pre-experiment survey questions
    const loadPreExperimentSurvey = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/survey/pre-experiment`);
        console.log('📊 Loaded pre-experiment survey questions:', response.data.questions.length);
        setSurveyQuestions(response.data.questions);
        setSurveyType('pre-experiment');
      } catch (error) {
        console.error('Failed to load pre-experiment survey questions:', error);
        // Skip to tutorial briefing if survey fails
        setShowTutorialBriefing(true);
      }
    };

    if (appState === 'INTRO') {
      loadPreExperimentSurvey();
    }
  }, [appState]);

  useEffect(() => {
    if (!participantId || !participantParity) {
      return;
    }

    // Send participant parity on initialization
    socket.emit('request:init', {
      participantId,
      participantParity
    });

    socket.on('init', (data) => {
      console.log('📦 Received init data from server:', {
        tickets: data.tickets?.length || 0,
        kbArticles: data.kbArticles?.length || 0,
        agents: data.agents?.length || 0,
        currentStage: data.currentStage,
        aiMode: data.aiMode,
        parity: data.participantParity
      });
      
      setTickets(data.tickets || []);
      setKb(data.kbArticles || []);
      setAgents(data.agents || []);
      if (data.aiMode) setAiMode(data.aiMode);
      if (data.participantParity) setParticipantParity(data.participantParity);
      
      // Critical check: don't revert to stage 1 if we are already at stage 2 locally
      if (data.currentStage) {
        // If the incoming stage is greater than or equal to what we have, accept it
        if (data.currentStage >= currentStageRef.current) {
          setCurrentStageIndex(data.currentStage);
        } else {
          console.warn(`⚠️ Ignoring outdated stage update from server. Server: ${data.currentStage}, Local: ${currentStageRef.current}`);
        }
      }
    });

    socket.on('tickets:update', (updatedTickets) => {
      console.log('🎫 Tickets updated:', updatedTickets.length, 'tickets');
      setTickets(updatedTickets);
    });
    
    socket.on('ticket:new', (newTicket) => {
      console.log('🆕 New ticket received:', newTicket.title);
      setTickets(prev => [newTicket, ...prev]);
    });
    
    socket.on('agents:update', (updatedAgents) => {
      console.log('👥 Agents updated:', updatedAgents.length, 'agents');
      setAgents(updatedAgents);
    });

    // Listen for timer updates from server
    socket.on('shift:timer:update', (data) => {
      console.log('⏱️ Received timer update from server:', data.timeLeft);
      setTimeLeft(data.timeLeft);
    });

    socket.on('shift:timeout', () => {
      console.log('⏰ Timeout received from server');
      forceFinishShift();
    });

    // Listen for AI mode changes from server
    socket.on('ai:mode_changed', (data) => {
      console.log('🤖 AI mode changed to:', data.aiMode);
      setAiMode(data.aiMode);
      addToast('System', `AI mode changed to: ${data.aiMode === 'normal' ? 'Normal' : 'Autonomous'}`, 'info');
    });

    socket.on('bot:notification', (data) => {
      console.log('👥 Bot notification:', data);
      addToast(data.botName, data.message, data.type);
    });

    socket.on('ai:notification', (data) => {
      console.log('🤖 AI notification:', data);
      addToast('AI Assistant', data.message, 'info');
    });

    socket.on('ai:autonomous_action', (data) => {
      console.log('🤖 AI autonomous action:', data);
      if (data.type === 'missed') {
        addToast('AI Assistant', `Missed ${data.ticketId.includes('critical') ? '🚨 CRITICAL ' : ''}ticket #${data.ticketId.slice(0, 5)}`, 'warning');
      } else if (data.type === 'solved') {
        addToast('AI Assistant', `Solved ${data.ticketId.includes('critical') ? '🚨 CRITICAL ' : ''}ticket #${data.ticketId.slice(0, 5)}`, 'success');
      } else if (data.type === 'failed') {
        addToast('AI Assistant', `Failed to solve ${data.ticketId.includes('critical') ? '🚨 CRITICAL ' : ''}ticket #${data.ticketId.slice(0, 5)}`, 'error');
      } else if (data.type === 'taken') {
        addToast('AI Assistant', `Took ${data.ticketId.includes('critical') ? '🚨 CRITICAL ' : ''}ticket #${data.ticketId.slice(0, 5)} to work`, 'info');
      }
    });

    socket.on('client:notification', (data) => {
      console.log('👤 Client notification:', data);
      addToast('Client', data.message, data.type);
    });
    
    // Listen for tutorial completion acknowledgment
    socket.on('tutorial:completed:ack', (data) => {
      console.log('✅ Tutorial completion acknowledged by server:', data);
    });

    return () => {
      socket.off('init');
      socket.off('tickets:update');
      socket.off('ticket:new');
      socket.off('agents:update');
      socket.off('shift:timer:update');
      socket.off('shift:timeout');
      socket.off('ai:mode_changed');
      socket.off('bot:notification');
      socket.off('ai:notification');
      socket.off('ai:autonomous_action');
      socket.off('client:notification');
      socket.off('tutorial:completed:ack');
    };
  }, [participantId, participantParity]);

  const addToast = (title, msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000);
  };

  // Handle pre-experiment survey completion
  const handlePreExperimentSurveyComplete = async (responses) => {
    try {
      await axios.post(`${API_BASE_URL}/api/survey/pre-experiment/submit`, {
        participantId,
        participantParity,
        responses
      });
      setSurveyQuestions([]);

      // Запускаем туториал сразу после опроса
      setShowTutorialBriefing(true);
    } catch (error) {
      console.error('Failed to submit pre-experiment survey:', error);
      setSurveyQuestions([]);
      setShowTutorialBriefing(true);
    }
  };

  // Handle post-experiment survey completion
  const handlePostExperimentSurveyComplete = async (responses) => {
    try {
      await axios.post(`${API_BASE_URL}/api/survey/post-experiment/submit`, {
        participantId,
        participantParity,
        responses
      });

      // После завершения пост-опросника показываем финальный экран
      setAppState('FINAL');
    } catch (error) {
      console.error('Failed to submit post-experiment survey:', error);
      setAppState('FINAL');
    }
  };

  // Load post-experiment survey
  const loadPostExperimentSurvey = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/survey/post-experiment?parity=${participantParity}`);
      console.log('📊 Loaded post-experiment survey questions:', response.data.questions.length);
      setSurveyQuestions(response.data.questions);
      setSurveyType('post-experiment');
      setAppState('SURVEY');
    } catch (error) {
      console.error('Failed to load post-experiment survey questions:', error);
      setAppState('FINAL');
    }
  };

  const startShift = async () => {
    try {
      // Ensure we are using the currentStageIndex from state, but default to 2 if we think we are past tutorial
      let stageToStart = currentStageIndex;
      if (appState === 'BRIEFING' && SCENARIOS[2] && SCENARIOS[currentStageIndex]?.title === SCENARIOS[2].title) {
        stageToStart = 2;
      }

      // For stage 2: if even participant - show AI mode selection
      if (stageToStart === 2 && participantParity === 'even') {
        setShowAIModeSelector(true);
        return;
      }

      await startShiftWithMode(aiMode);
    } catch (error) {
      console.error('Error starting shift:', error);
      addToast('System', 'Failed to start shift. Please try again.', 'error');
    }
  };

  const startShiftWithMode = async (selectedAiMode) => {
    try {
      // Ensure we send stage 2 if we are in the briefing for stage 2
      let stageToStart = currentStageIndex;
      if (currentStageRef.current === 2) {
        stageToStart = 2;
      }
      
      console.log(`Starting shift with stage: ${stageToStart}, parity: ${participantParity}, AI mode: ${selectedAiMode}, participantId: ${participantId}`);

      const response = await axios.post(`${API_BASE_URL}/admin/start`, {
        stage: stageToStart,
        aiMode: stageToStart === 2 && participantParity === 'even' ? selectedAiMode : 'normal',
        participantParity,
        participantId
      });

      console.log('Admin start response:', response.data);

      if (stageToStart !== 1) {
        const duration = SHIFT_DURATION_SEC;
        setTimeLeft(duration);
      } else {
        // Tutorial has no time limit
        setTimeLeft(0);
      }

      setAppState('ACTIVE');

      // Welcome messages only at stage 2 for odd participants
      if (stageToStart === 2 && participantParity === 'odd') {
        setTimeout(() => {
          agents.forEach(agent => {
            if (agent.trust > 0.7) {
              addToast(agent.name, agent.greeting, "success");
            }
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error starting shift with mode:', error);
      addToast('System', 'Failed to start shift. Please try again.', 'error');
      throw error;
    }
  };

  const finishShift = () => {
    // Сохраняем статистику текущего этапа перед переходом
    const currentStats = calculateStageStats(tickets, participantParity);
    setStageStats(prev => ({
      ...prev,
      [currentStageIndex]: currentStats
    }));
    
    setAppState('SUMMARY');
    setTimeLeft(0);
  };

  const forceFinishShift = () => {
    // Сохраняем статистику текущего этапа перед переходом
    const currentStats = calculateStageStats(tickets, participantParity);
    setStageStats(prev => ({
      ...prev,
      [currentStageIndex]: currentStats
    }));
    
    setTimeLeft(0);
    setAppState('SUMMARY');
  };

  // Функция для вычисления статистики этапа
  const calculateStageStats = (stageTickets, parity) => {
    const total = stageTickets.length;
    const solvedMe = stageTickets.filter(t => t.status === 'solved' && t.solutionAuthor === 'participant').length;
    const solvedOthers = stageTickets.filter(t => t.status === 'solved' && t.solutionAuthor !== 'participant' && t.solutionAuthor !== 'AI').length;
    const solvedAI = stageTickets.filter(t => t.status === 'solved' && t.solutionAuthor === 'AI').length;
    const missedAssign = stageTickets.filter(t => t.status === 'not assigned').length;
    const unsolved = stageTickets.filter(t => t.status === 'in Progress').length;
    const criticalTickets = stageTickets.filter(t => t.isCritical).length;
    const criticalSolved = stageTickets.filter(t => t.isCritical && t.status === 'solved').length;
    
    return {
      total, solvedMe, solvedOthers, solvedAI, missedAssign, unsolved, criticalTickets, criticalSolved
    };
  };

  const finishTutorial = async () => {
    try {
      console.log('🎓 Finishing tutorial...');

      // Сохраняем статистику туториала
      const tutorialStats = calculateStageStats(
        tickets.filter(t => t.isTutorial),
        participantParity
      );
      setStageStats(prev => ({
        ...prev,
        1: tutorialStats
      }));

      // Сохраняем состояние в sessionStorage
      sessionStorage.setItem('tutorialCompleted', 'true');
      sessionStorage.setItem('currentStage', '2');
      sessionStorage.setItem('participantId', participantId);
      sessionStorage.setItem('participantParity', participantParity);

      // Отправляем событие на сервер о завершении туториала
      socket.emit('tutorial:completed', {
        participantId,
        participantParity
      });

      // Переходим к следующему этапу немедленно
      proceedToStage2();

    } catch (error) {
      console.error('Error finishing tutorial:', error);
      // В случае ошибки все равно переходим к следующему этапу
      proceedToStage2();
    }
  };

  // Вспомогательная функция для перехода к этапу 2
  const proceedToStage2 = () => {
    console.log('🚀 Proceeding to stage 2...');

    // Принудительно устанавливаем стадию 2
    setCurrentStageIndex(2);
    currentStageRef.current = 2; // Обновляем ref синхронно для слушателей сокетов
    setAppState('BRIEFING');

    // Очищаем sessionStorage от временных данных
    sessionStorage.removeItem('tutorialCompleted');
    sessionStorage.removeItem('currentStage');

    console.log('✅ Successfully transitioned to stage 2 UI');
  };

  // Handle AI mode change during experiment
  const handleChangeAiMode = async (newAiMode) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/change-ai-mode`, {
        aiMode: newAiMode,
        participantParity,
        participantId
      });

      if (response.data.success) {
        setAiMode(response.data.aiMode);
        setShowAIModeSelector(false);
        addToast('System', `AI mode changed to ${newAiMode === 'normal' ? 'Normal' : 'Autonomous'}`, 'success');
      }
    } catch (error) {
      console.error('Error changing AI mode:', error);
      addToast('System', 'Failed to change AI mode', 'error');
    }
  };

  // Handle HTML viewer close
  const handleHtmlViewerClose = () => {
    setShowHtmlViewer(false);
  };

  // Handle HTML viewer start tutorial - запускает туториал без показа инструкций
  const handleHtmlViewerStartTutorial = async () => {
    try {
      setShowHtmlViewer(false);
      await startShiftWithMode(aiMode);
    } catch (error) {
      console.error('Error starting tutorial from HTML viewer:', error);
    }
  };

  if (appState === 'INTRO') return (
    <div className="h-screen bg-slate-950 flex items-center justify-center p-4 text-white text-center">
      <div className="max-w-xl bg-slate-900 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-white/10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Disclaimer</h1>
        <p className="text-slate-400 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
          This is a scientific experiment simulating IT support work. All interactions are logged anonymously for research purposes.
        </p>
        <button
          onClick={() => setAppState('SURVEY')}
          className="w-full bg-cyan-500 text-black py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest hover:bg-cyan-600 transition-colors text-sm sm:text-base min-h-[44px]"
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* Tutorial Briefing Screen */}
      {showTutorialBriefing && (
        <TutorialBriefingScreen
          onContinue={async () => {
            setShowTutorialBriefing(false);
            // Запускаем туториал сразу, без показа инструкций
            try {
              await startShiftWithMode(aiMode);
            } catch (error) {
              console.error('Error starting tutorial:', error);
            }
          }}
        />
      )}

      {/* HTML Instruction Viewer */}
      {showHtmlViewer && (
        <HtmlViewer
          onClose={handleHtmlViewerClose}
          isTutorialMode={htmlViewerMode === 'tutorial'}
          onStartTutorial={htmlViewerMode === 'tutorial' ? handleHtmlViewerStartTutorial : null}
        />
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && isMobile && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/90 backdrop-blur">
          <div className="flex flex-col h-full bg-slate-900 border-r border-white/10">
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
              <div className="text-cyan-400 font-black italic text-xl">ITSM</div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400">
                <X size={24} />
              </button>
            </div>
            <nav className="p-4 space-y-2 flex-1">
              <Link
                to="/tickets"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${location.pathname.includes('tickets') ? 'bg-cyan-500/10 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                <Ticket size={20} /> <span>Tickets</span>
              </Link>
              <Link
                to="/kb"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${location.pathname.includes('/kb') ? 'bg-cyan-500/10 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                <Book size={20} /> <span>Knowledge Base</span>
              </Link>
              <Link
                to="/agents"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${location.pathname.includes('agents') ? 'bg-cyan-500/10 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                <Users size={20} /> <span>Colleagues</span>
              </Link>
            </nav>
            <div className="p-4 bg-black/20 space-y-2">
              <button
                onClick={() => {
                  setHtmlViewerMode('reference');
                  setShowHtmlViewer(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 py-2 rounded-lg text-[10px] uppercase font-black hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <FileText size={12} /> View Instructions
              </button>
              <button
                onClick={forceFinishShift}
                className="w-full bg-amber-500/10 text-amber-500 border border-amber-500/20 py-2 rounded-lg text-[10px] uppercase font-black hover:bg-amber-500 hover:text-black transition-all"
              >
                DEBUG: End Shift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex ${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-black/40 border-r border-white/10 flex-col transition-all duration-300`}>
        <div className="h-16 flex items-center justify-center border-b border-white/5 text-cyan-400 font-black italic text-xl sm:text-2xl tracking-tighter">ITSM</div>
        <nav className="p-4 space-y-2 flex-1">
          <Link
            to="/tickets"
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${location.pathname.includes('tickets') ? 'bg-cyan-500/10 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            <Ticket size={20} /> {!isSidebarCollapsed && <span>Tickets</span>}
          </Link>
          <Link
            to="/kb"
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${location.pathname.includes('/kb') ? 'bg-cyan-500/10 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            <Book size={20} /> {!isSidebarCollapsed && <span>Knowledge Base</span>}
          </Link>
          <Link
            to="/agents"
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${location.pathname.includes('agents') ? 'bg-cyan-500/10 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            <Users size={20} /> {!isSidebarCollapsed && <span>Colleagues</span>}
          </Link>
        </nav>
        <div className="p-4 bg-black/20 space-y-2">
          <button
            onClick={() => {
              setHtmlViewerMode('reference');
              setShowHtmlViewer(true);
            }}
            className="w-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 py-2 rounded-lg text-[10px] uppercase font-black hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <FileText size={12} /> {!isSidebarCollapsed && "View Instructions"}
          </button>
          <button
            onClick={forceFinishShift}
            className="w-full bg-amber-500/10 text-amber-500 border border-amber-500/20 py-2 rounded-lg text-[10px] uppercase font-black hover:bg-amber-500 hover:text-black transition-all"
          >
            {!isSidebarCollapsed && "DEBUG: End"}
          </button>
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full py-2 flex justify-center text-slate-600 hover:text-white"
          >
            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>
      </aside>

      {/* Toast Notifications */}
      <div className="absolute top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none max-w-[90vw]">
        {toasts.map(t => {
          const isCriticalToast = t.msg?.includes('🚨') || t.msg?.includes('CRITICAL');

          return (
            <div
              key={t.id}
              className={`pointer-events-auto p-3 sm:p-4 rounded-xl border shadow-2xl min-w-[250px] sm:min-w-[300px] animate-in slide-in-from-right max-w-[90vw]
                ${isCriticalToast
                  ? 'bg-gradient-to-r from-red-900/90 to-amber-900/80 border-red-500 animate-pulse-subtle'
                  : t.type === 'error'
                    ? 'bg-rose-900/90 border-rose-500'
                    : t.type === 'success'
                      ? 'bg-emerald-900/90 border-emerald-500'
                      : t.type === 'warning'
                        ? 'bg-amber-900/90 border-amber-500'
                        : 'bg-slate-800 border-white/10'}`}
            >
              <div className="font-bold text-sm mb-1 flex items-center gap-2 truncate">
                {isCriticalToast
                  ? <Flame size={14} className="text-amber-400" />
                  : t.type === 'error'
                    ? <XCircle size={14} />
                    : t.type === 'success'
                      ? <CheckCircle2 size={14} />
                      : <MessageSquare size={14} />}
                {t.title}
              </div>
              <div className={`text-xs opacity-90 break-words ${isCriticalToast ? 'text-amber-100' : ''}`}>{t.msg}</div>
            </div>
          );
        })}
      </div>

      {/* Pre-experiment survey window */}
      {appState === 'SURVEY' && surveyType === 'pre-experiment' && surveyQuestions.length > 0 && (
        <SurveyScreen
          questions={surveyQuestions}
          onComplete={handlePreExperimentSurveyComplete}
          title="Pre-experiment Survey"
          description="Please answer a few questions before starting the experiment. Your answers will help us improve the research."
        />
      )}

      {/* Post-experiment survey window */}
      {appState === 'SURVEY' && surveyType === 'post-experiment' && surveyQuestions.length > 0 && (
        <SurveyScreen
          questions={surveyQuestions}
          onComplete={handlePostExperimentSurveyComplete}
          title="Final Survey"
          description="Please answer questions about your experience working in the technical support system. Your answers are very important for our research."
        />
      )}

      {appState === 'BRIEFING' && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-cyan-500/30 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{SCENARIOS[currentStageIndex]?.title}</h2>
            <p className="text-slate-400 mb-4 sm:mb-8 text-sm sm:text-base">
              {currentStageIndex === 2 ? getStage2Description(participantParity) : SCENARIOS[currentStageIndex]?.description}
            </p>

            <div className="mb-3 sm:mb-4 text-xs text-slate-500">
              <p>Participant ID: <span className="font-mono text-amber-400">{participantId}</span></p>
            </div>

            {currentStageIndex === 2 && participantParity === 'even' && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-xl sm:rounded-2xl">
                <div className="flex items-center justify-center mb-2 text-indigo-300">
                  <Bot size={16} className="sm:size-[18px] mr-2" />
                  <span className="font-medium text-sm sm:text-base">AI Mode: {aiMode === 'normal' ? 'Normal' : 'Autonomous'}</span>
                </div>
                <p className="text-sm text-slate-300 mb-3">
                  {aiMode === 'normal'
                    ? 'AI will give you advice on request. Use the "Ask AI" button in tickets.'
                    : 'AI will solve tickets independently. It may skip some tickets or solve them incorrectly.'}
                </p>
              </div>
            )}

            {currentStageIndex === 2 && participantParity === 'odd' && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-amber-900/20 border border-amber-500/30 rounded-xl sm:rounded-2xl">
                <div className="flex items-center justify-center mb-2 text-amber-300">
                  <Users size={16} className="sm:size-[18px] mr-2" />
                  <span className="font-medium text-sm sm:text-base">Team Work</span>
                </div>
                <p className="text-sm text-slate-300 mb-3">
                  Your colleagues will be available to help. You can delegate tickets to them by clicking the button in ticket details.
                </p>
              </div>
            )}

            <button
              onClick={startShift}
              className="w-full bg-cyan-500 text-black py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest hover:bg-cyan-600 transition-colors text-sm sm:text-base min-h-[44px]"
            >
              {currentStageIndex === 1 ? "Start Tutorial" : "Start Experiment"}
            </button>
          </div>
        </div>
      )}

      {/* AI mode selection for even participants at stage 2 */}
      {showAIModeSelector && (
        <AIModeSelector
          aiMode={aiMode}
          setAiMode={setAiMode}
          onClose={() => setShowAIModeSelector(false)}
          onConfirm={async () => {
            setShowAIModeSelector(false);
            try {
              await startShiftWithMode(aiMode);
            } catch (error) {
              console.error('Error starting shift after AI mode selection:', error);
              addToast('System', 'Failed to start shift. Please try again.', 'error');
            }
          }}
        />
      )}

      {/* Summary window after each stage */}
      {appState === 'SUMMARY' && (
        <SummaryScreen
          tickets={tickets}
          isLastStage={currentStageIndex >= 2}
          participantParity={participantParity}
          stageTicketsStats={stageStats[currentStageIndex]}
          onNext={() => {
            if (currentStageIndex < 2) {
              setCurrentStageIndex(p => p + 1);
              setAppState('BRIEFING');
            } else {
              // After completing stage 2, show experiment completion screen
              setAppState('EXPERIMENT_COMPLETE');
            }
          }}
        />
      )}

      {/* Experiment completion screen (before post-survey) */}
      {appState === 'EXPERIMENT_COMPLETE' && (
        <ExperimentCompleteScreen
          onSurveyComplete={loadPostExperimentSurvey}
        />
      )}

      {/* Final screen after completing all surveys */}
      {appState === 'FINAL' && (
        <FinalScreen
          onReset={() => {
            // Очищаем все данные из localStorage
            localStorage.clear();
            // Перезагружаем страницу для нового эксперимента
            window.location.reload();
          }}
        />
      )}

      {/* Finish Tutorial Button (shown during tutorial) */}
      {appState === 'ACTIVE' && currentStageIndex === 1 && (
        <FinishTutorialButton onFinish={finishTutorial} />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 sm:px-8 bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-slate-400 hover:text-white p-1"
              >
                <Menu size={24} />
              </button>
            )}
            <div>
              <h1 className="font-bold text-white text-base sm:text-lg">Workplace</h1>
              <div className="text-[10px] uppercase text-slate-500 tracking-widest font-bold">
                {currentStageIndex === 1 ? "Tutorial Mode" : "Shift Active"}
              </div>
            </div>
          </div>

          {appState === 'ACTIVE' && (
            <div className="absolute left-1/2 -translate-x-1/2">
              <ShiftTimer timeLeft={timeLeft} isTutorial={currentStageIndex === 1} />
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* Кнопка смены режима ИИ для четных участников на втором этапе (во время активной смены) */}
            {appState === 'ACTIVE' && currentStageIndex === 2 && participantParity === 'even' && (
              <button
                onClick={() => setShowAIModeSelector(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/30 border border-indigo-500/50 text-indigo-100 rounded-xl hover:bg-indigo-600 transition-colors text-sm"
              >
                <Bot size={14} />
                <span className="hidden sm:inline">AI Mode: {aiMode === 'normal' ? 'Normal' : 'Autonomous'}</span>
              </button>
            )}
            <div className="hidden sm:flex text-xs text-slate-500">
              <span className="font-mono">{participantId.slice(0, 8)}...</span>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-800 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-black">
              ME
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<Navigate to="/tickets" replace />} />
            <Route path="/tickets" element={<TicketsPage tickets={tickets} socket={socket} navigate={navigate} currentStage={currentStageIndex} />} />
            <Route path="/tickets/:id" element={<TicketDetailPage tickets={tickets} kb={kb} agents={agents} socket={socket} navigate={navigate} areAgentsOnline={areAgentsOnline} currentStage={currentStageIndex} aiMode={aiMode} participantParity={participantParity} />} />
            <Route path="/kb" element={<KBListPage kb={kb} navigate={navigate} />} />
            <Route path="/kb/:id" element={<KBDetailPage kb={kb} navigate={navigate} />} />
            <Route path="/agents" element={
              <div className="p-4 sm:p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-20 md:pb-0">
                {agents.map(a => {
                  const isGlobalOnline = areAgentsOnline;
                  const isPersonallyOnline = a.status === 'online';

                  return (
                    <div
                      key={a.id}
                      className={`p-4 bg-white/5 border border-white/5 rounded-xl sm:rounded-3xl text-center transition-opacity ${isGlobalOnline ? 'opacity-100' : 'opacity-30'}`}
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl mb-3 sm:mb-4 flex items-center justify-center font-bold text-white ${isPersonallyOnline ? 'bg-indigo-500' : 'bg-amber-600'}`}>
                        {a.name[0]}
                      </div>
                      <h3 className="font-bold text-white text-sm sm:text-base">{a.name}</h3>
                      <p className={`text-[10px] sm:text-xs mt-2 uppercase font-black ${!isGlobalOnline ? 'text-slate-500' : isPersonallyOnline ? 'text-green-500' : 'text-amber-500'}`}>
                        {!isGlobalOnline ? 'Offline' : isPersonallyOnline ? 'Online' : 'Away'}
                      </p>
                    </div>
                  )
                })}
              </div>
            } />
          </Routes>
        </div>

        {/* Mobile Bottom Navigation */}
        {appState === 'ACTIVE' && isMobile && (
          <MobileBottomNav activeRoute={location.pathname} navigate={navigate} />
        )}
      </main>
    </div>
  );
}