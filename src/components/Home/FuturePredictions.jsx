import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, MapPin, User, Sparkles, Crown, Shield, Target,
    TrendingUp, Heart, DollarSign, Activity, CheckCircle, Loader,
    AlertCircle, RefreshCw, BookOpen, Star, Zap, Award, Eye, EyeOff,
    Menu, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setPrediction, setLoading, setError, clearPrediction } from '../../redux/slices/predictionSlice';
import astroServices from '../../server/astroServices';

const FuturePredictions = () => {
    const user = useSelector((state) => state.auth.user);
    const { futurePrediction, loading, error, lastFetched } = useSelector((state) => state.prediction);
    const dispatch = useDispatch();

    const [userBirthDetails, setUserBirthDetails] = useState(null);
    const [activeView, setActiveView] = useState('organized');
    const [predictionHistory, setPredictionHistory] = useState([]);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        profile: true,
        actions: false,
        history: false
    });

    useEffect(() => {
        if (user) {
            checkBirthDetails();
            const savedHistory = localStorage.getItem('predictionHistory');
            if (savedHistory) {
                setPredictionHistory(JSON.parse(savedHistory));
            }
        }
    }, [user]);

    const checkBirthDetails = () => {
        const birthDetails = {
            username: user?.username || 'Not available',
            birth_year: user?.birth_year,
            birth_month: user?.birth_month,
            birth_day: user?.birth_day,
            birth_hour: user?.birth_hour,
            birth_minute: user?.birth_minute,
            birth_place: user?.birth_place || 'Not set'
        };
        setUserBirthDetails(birthDetails);

        const isComplete = birthDetails.birth_year &&
            birthDetails.birth_month &&
            birthDetails.birth_day &&
            birthDetails.birth_hour !== null &&
            birthDetails.birth_minute !== null &&
            birthDetails.birth_minute !== undefined &&
            birthDetails.birth_place;

        if (!isComplete) {
            dispatch(setError('Your birth details are incomplete. Please update your profile to get future predictions.'));
        }
    };

    const getFuturePrediction = async () => {
        const twentyFourHours = 24 * 60 * 60 * 1000;
        if (lastFetched && (Date.now() - lastFetched) < twentyFourHours && futurePrediction) {
            return;
        }

        dispatch(setLoading());

        try {
            const data = await astroServices.future_predictions();

            if (!data || !data.future_prediction) {
                throw new Error('Invalid response from prediction service');
            }

            const newPrediction = {
                ...data,
                timestamp: Date.now(),
                date: new Date().toLocaleDateString()
            };

            const updatedHistory = [newPrediction, ...predictionHistory.slice(0, 4)];
            setPredictionHistory(updatedHistory);
            localStorage.setItem('predictionHistory', JSON.stringify(updatedHistory));

            dispatch(setPrediction(data));
            setMobileSidebarOpen(false); // Close sidebar on mobile after getting prediction
        } catch (err) {
            console.error('Prediction error:', err);
            dispatch(setError(err.response?.data?.error || err.message || 'Failed to get prediction. Please try again.'));
        }
    };

    const handleRefreshPrediction = async () => {
        dispatch(clearPrediction());
        await getFuturePrediction();
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const formatPredictionText = (text) => {
        if (!text) return [];
        const sections = text.split(/(?=\*\*[A-Za-z\s&]+\*\*)/g);
        return sections
            .map(section => section.trim())
            .filter(section => {
                const hasTitle = section.match(/\*\*([^*]+)\*\*/);
                return section.length > 20 && hasTitle;
            });
    };

    const getSectionIcon = (sectionText) => {
        const text = sectionText.toLowerCase();
        if (text.includes('career') || text.includes('professional'))
            return <TrendingUp size={18} className="text-blue-400" />;
        if (text.includes('relationship') || text.includes('personal'))
            return <Heart size={18} className="text-pink-400" />;
        if (text.includes('finance') || text.includes('wealth'))
            return <DollarSign size={18} className="text-green-400" />;
        if (text.includes('health') || text.includes('wellbeing'))
            return <Activity size={18} className="text-purple-400" />;
        if (text.includes('suggestion') || text.includes('actionable'))
            return <CheckCircle size={18} className="text-yellow-400" />;
        if (text.includes('opportunit'))
            return <Target size={18} className="text-green-400" />;
        if (text.includes('consideration'))
            return <AlertCircle size={18} className="text-orange-400" />;
        return <Sparkles size={18} className="text-indigo-400" />;
    };

    const getSectionColor = (sectionText) => {
        const text = sectionText.toLowerCase();
        if (text.includes('career')) return 'border-l-blue-500 bg-blue-500/5';
        if (text.includes('relationship')) return 'border-l-pink-500 bg-pink-500/5';
        if (text.includes('finance') || text.includes('wealth')) return 'border-l-green-500 bg-green-500/5';
        if (text.includes('health') || text.includes('wellbeing')) return 'border-l-purple-500 bg-purple-500/5';
        if (text.includes('suggestion') || text.includes('actionable')) return 'border-l-yellow-500 bg-yellow-500/5';
        if (text.includes('opportunit')) return 'border-l-green-500 bg-green-500/5';
        if (text.includes('consideration')) return 'border-l-orange-500 bg-orange-500/5';
        return 'border-l-indigo-500 bg-indigo-500/5';
    };

    const getSectionTitle = (sectionText) => {
        const lines = sectionText.split('\n');
        const firstLine = lines[0] || '';
        const titleMatch = firstLine.match(/\*\*([^*]+)\*\*/);
        if (titleMatch) {
            return titleMatch[1].trim();
        }
        return firstLine.substring(0, 30) + (firstLine.length > 30 ? '...' : '');
    };

    const formatSectionContent = (sectionText) => {
        const lines = sectionText.split('\n');
        const contentLines = lines.slice(1);
        const content = contentLines.join('\n');
        return content
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .trim();
    };

    const formatBirthTime = (hour, minute) => {
        if (hour === null || hour === undefined || minute === null || minute === undefined) {
            return 'Not set';
        }
        const hourNum = Number(hour);
        const minuteNum = Number(minute);
        if (isNaN(hourNum) || isNaN(minuteNum)) {
            return 'Not set';
        }
        return `${hourNum.toString().padStart(2, '0')}:${minuteNum.toString().padStart(2, '0')}`;
    };

    const formatBirthDate = (year, month, day) => {
        if (!year || !month || !day) {
            return 'Not set';
        }
        const yearNum = Number(year);
        const monthNum = Number(month);
        const dayNum = Number(day);
        if (isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum)) {
            return 'Not set';
        }
        return `${yearNum}-${monthNum.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
    };

    const getDisplayValue = (value, fallback = 'Not set') => {
        if (value === null || value === undefined || value === '') {
            return fallback;
        }
        return value;
    };

    if (!user) {
        return (
            <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                        <AlertCircle size={48} className="text-yellow-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
                        <p className="text-gray-400 mb-6">Please log in to access your future predictions.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Mobile Sidebar Component
    const MobileSidebar = () => (
        <AnimatePresence>
            {mobileSidebarOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                    
                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed left-0 top-0 h-full w-80 bg-slate-900 border-r border-white/10 z-50 lg:hidden overflow-y-auto"
                    >
                        <div className="p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">Navigation</h2>
                                <button
                                    onClick={() => setMobileSidebarOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-white" />
                                </button>
                            </div>

                            {/* Profile Section */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                                <button
                                    onClick={() => toggleSection('profile')}
                                    className="w-full flex items-center justify-between text-white font-semibold mb-2"
                                >
                                    <span className="flex items-center gap-2">
                                        <User size={18} className="text-purple-400" />
                                        Your Profile
                                    </span>
                                    {expandedSections.profile ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                <AnimatePresence>
                                    {expandedSections.profile && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="space-y-3 pt-2">
                                                <div>
                                                    <div className="text-gray-400 text-xs mb-1">Name</div>
                                                    <div className="text-white text-sm">{getDisplayValue(userBirthDetails?.username)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-400 text-xs mb-1">Birth Date</div>
                                                    <div className="text-white text-sm">
                                                        {formatBirthDate(userBirthDetails?.birth_year, userBirthDetails?.birth_month, userBirthDetails?.birth_day)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-400 text-xs mb-1">Birth Time</div>
                                                    <div className="text-white text-sm">
                                                        {formatBirthTime(userBirthDetails?.birth_hour, userBirthDetails?.birth_minute)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-400 text-xs mb-1">Birth Place</div>
                                                    <div className="text-white text-sm">{getDisplayValue(userBirthDetails?.birth_place)}</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                                <button
                                    onClick={() => toggleSection('actions')}
                                    className="w-full flex items-center justify-between text-white font-semibold mb-2"
                                >
                                    <span className="flex items-center gap-2">
                                        <Zap size={18} className="text-yellow-400" />
                                        Quick Actions
                                    </span>
                                    {expandedSections.actions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                <AnimatePresence>
                                    {expandedSections.actions && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="space-y-2 pt-2">
                                                <button
                                                    onClick={() => {
                                                        setActiveView(activeView === 'organized' ? 'full' : 'organized');
                                                        setMobileSidebarOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                                                >
                                                    {activeView === 'organized' ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    <span className="text-white text-sm">
                                                        {activeView === 'organized' ? 'Full View' : 'Organized View'}
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleRefreshPrediction();
                                                        setMobileSidebarOpen(false);
                                                    }}
                                                    disabled={loading}
                                                    className="w-full flex items-center gap-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors disabled:opacity-50"
                                                >
                                                    <RefreshCw size={16} />
                                                    <span className="text-white text-sm">Refresh</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Prediction History */}
                            {predictionHistory.length > 0 && (
                                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                                    <button
                                        onClick={() => toggleSection('history')}
                                        className="w-full flex items-center justify-between text-white font-semibold mb-2"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Calendar size={18} className="text-blue-400" />
                                            History
                                        </span>
                                        {expandedSections.history ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    <AnimatePresence>
                                        {expandedSections.history && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="space-y-2 pt-2">
                                                    {predictionHistory.slice(0, 3).map((pred, index) => (
                                                        <div
                                                            key={index}
                                                            className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                                                            onClick={() => {
                                                                dispatch(setPrediction(pred));
                                                                setActiveView('organized');
                                                                setMobileSidebarOpen(false);
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                                <Star size={10} className="text-yellow-400" />
                                                                <span>{pred.date}</span>
                                                            </div>
                                                            <p className="text-white text-xs mt-1 line-clamp-2">
                                                                {pred.future_prediction?.substring(0, 40)}...
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    return (
        <div className="min-h-screen pt-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
            {/* Mobile Sidebar */}
            <MobileSidebar />

            <div className="max-w-7xl mx-auto">
                {/* Header with Mobile Menu Button */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-8 relative"
                >
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileSidebarOpen(true)}
                        className="lg:hidden absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 transition-colors"
                    >
                        <Menu size={20} className="text-white" />
                    </button>

                    <div className="flex items-center justify-center gap-3 mb-4 lg:justify-center">
                        <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl">
                            <Crown size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Future Predictions
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Personalized Vedic astrology predictions for the next year
                    </p>
                </motion.div>

                {/* Main Grid Layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Desktop Sidebar - Hidden on mobile */}
                    <div className="hidden lg:block lg:w-80 flex-shrink-0">
                        <div className="sticky top-24 space-y-6">
                            {/* User Profile Card */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                            >
                                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                    <User size={20} className="text-purple-400" />
                                    Your Profile
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-gray-400 text-sm mb-1">Name</div>
                                        <div className="text-white font-medium">{getDisplayValue(userBirthDetails?.username)}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-sm mb-1">Birth Date</div>
                                        <div className="text-white font-medium">
                                            {formatBirthDate(userBirthDetails?.birth_year, userBirthDetails?.birth_month, userBirthDetails?.birth_day)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-sm mb-1">Birth Time</div>
                                        <div className="text-white font-medium">
                                            {formatBirthTime(userBirthDetails?.birth_hour, userBirthDetails?.birth_minute)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-sm mb-1">Birth Place</div>
                                        <div className="text-white font-medium">{getDisplayValue(userBirthDetails?.birth_place)}</div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={getFuturePrediction}
                                    disabled={loading || error?.includes('incomplete')}
                                    className={`w-full mt-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${loading || error?.includes('incomplete')
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                                        }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader size={18} className="animate-spin" />
                                            Calculating...
                                        </div>
                                    ) : error?.includes('incomplete') ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <AlertCircle size={18} />
                                            Complete Profile
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <Sparkles size={18} />
                                            {futurePrediction ? 'Update Prediction' : 'Get Prediction'}
                                        </div>
                                    )}
                                </motion.button>

                                {/* Error Message */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                                        >
                                            <p className="text-red-300 text-sm">{error}</p>
                                            {error.includes('incomplete') && (
                                                <button
                                                    onClick={() => window.location.href = '/profile'}
                                                    className="mt-2 w-full py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 text-sm transition-colors"
                                                >
                                                    Update Profile
                                                </button>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Quick Actions */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                            >
                                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                    <Zap size={20} className="text-yellow-400" />
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setActiveView(activeView === 'organized' ? 'full' : 'organized')}
                                        className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                                    >
                                        {activeView === 'organized' ? <EyeOff size={18} /> : <Eye size={18} />}
                                        <span className="text-white text-sm">
                                            {activeView === 'organized' ? 'Full View' : 'Organized View'}
                                        </span>
                                    </button>
                                    <button
                                        onClick={handleRefreshPrediction}
                                        disabled={loading}
                                        className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors disabled:opacity-50"
                                    >
                                        <RefreshCw size={18} />
                                        <span className="text-white text-sm">Refresh</span>
                                    </button>
                                </div>
                            </motion.div>

                            {/* Prediction History */}
                            {predictionHistory.length > 0 && (
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                                >
                                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                        <Calendar size={20} className="text-blue-400" />
                                        History
                                    </h3>
                                    <div className="space-y-2">
                                        {predictionHistory.slice(0, 3).map((pred, index) => (
                                            <div
                                                key={index}
                                                className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                                                onClick={() => {
                                                    dispatch(setPrediction(pred));
                                                    setActiveView('organized');
                                                }}
                                            >
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Star size={12} className="text-yellow-400" />
                                                    <span>{pred.date}</span>
                                                </div>
                                                <p className="text-white text-xs mt-1 line-clamp-2">
                                                    {pred.future_prediction?.substring(0, 50)}...
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {futurePrediction ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Prediction Header */}
                                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-1">Your Future Prediction</h2>
                                            <p className="text-gray-400 text-sm">
                                                Based on Vedic astrology for the next 1 year
                                                {lastFetched && (
                                                    <span className="ml-2 text-gray-500">
                                                        • Generated: {new Date(lastFetched).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setActiveView('organized')}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeView === 'organized'
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                                    }`}
                                            >
                                                Organized
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setActiveView('full')}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeView === 'full'
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                                    }`}
                                            >
                                                Full Text
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>

                                {/* Prediction Content */}
                                {activeView === 'full' ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 rounded-2xl p-6 border border-white/10 backdrop-blur-sm"
                                    >
                                        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
                                            {futurePrediction.future_prediction}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="grid lg:grid-cols-2 gap-6">
                                        {formatPredictionText(futurePrediction.future_prediction).map((section, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={`border-l-4 ${getSectionColor(section)} rounded-xl p-5 border border-white/10 backdrop-blur-sm h-fit`}
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="p-2 rounded-lg bg-white/10">
                                                        {getSectionIcon(section)}
                                                    </div>
                                                    <h3 className="text-white font-bold text-lg">
                                                        {getSectionTitle(section)}
                                                    </h3>
                                                </div>
                                                <div className="text-gray-300 space-y-2 text-sm leading-relaxed">
                                                    {formatSectionContent(section).split('\n').map((line, lineIndex) => (
                                                        line.trim() && (
                                                            <div key={lineIndex} className="flex items-start gap-2">
                                                                {line.startsWith('-') || line.match(/^\d\./) ? (
                                                                    <div className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0 opacity-60"></div>
                                                                ) : null}
                                                                <p className="flex-1">
                                                                    {line.replace(/^- /, '').replace(/^\d\./, '').trim()}
                                                                </p>
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 border-dashed text-center"
                            >
                                <div className="max-w-md mx-auto">
                                    <Sparkles size={48} className="text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">No Prediction Yet</h3>
                                    <p className="text-gray-400 mb-6">
                                        Get your personalized future prediction based on Vedic astrology principles and planetary positions.
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={getFuturePrediction}
                                        disabled={loading || error?.includes('incomplete')}
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                                    >
                                        Generate Prediction
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FuturePredictions;