import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Mail, Link as LinkIcon, Trash2, AlertTriangle, CheckCircle, Loader2, Activity, Clock, TrendingUp } from 'lucide-react';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { ScrollArea } from './components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

interface AnalysisResult {
  id: string;
  type: 'email' | 'url';
  content: string;
  isPhishing: boolean;
  confidence: number;
  threats: string[];
  timestamp: Date;
}

export default function App() {
  const [emailContent, setEmailContent] = useState('');
  const [urlContent, setUrlContent] = useState('');
  const [activeTab, setActiveTab] = useState<'email' | 'url'>('email');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  // Force dark background on body
  useEffect(() => {
    document.body.style.backgroundColor = '#121212';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    };
  }, []);

  // Mock phishing detection logic
  const analyzeContent = async (content: string, type: 'email' | 'url'): Promise<AnalysisResult> => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const phishingKeywords = [
      'verify your account',
      'urgent action required',
      'suspicious activity',
      'confirm your identity',
      'click here immediately',
      'prize winner',
      'bank account',
      'password expired',
      'social security',
      'tax refund'
    ];

    const suspiciousUrlPatterns = [
      'bit.ly',
      'tinyurl',
      'paypa1',
      'arnaz0n',
      'micros0ft',
      'app1e',
      'g00gle'
    ];

    const lowerContent = content.toLowerCase();
    const threats: string[] = [];
    let isPhishing = false;

    if (type === 'email') {
      phishingKeywords.forEach(keyword => {
        if (lowerContent.includes(keyword)) {
          threats.push(`Suspicious phrase detected: "${keyword}"`);
          isPhishing = true;
        }
      });

      if (lowerContent.includes('http://') && !lowerContent.includes('https://')) {
        threats.push('Contains unsecured HTTP links');
        isPhishing = true;
      }

      if ((lowerContent.match(/@/g) || []).length > 2) {
        threats.push('Multiple email addresses detected');
        isPhishing = true;
      }
    } else {
      suspiciousUrlPatterns.forEach(pattern => {
        if (lowerContent.includes(pattern)) {
          threats.push(`Suspicious URL pattern: "${pattern}"`);
          isPhishing = true;
        }
      });

      if (!lowerContent.startsWith('https://')) {
        threats.push('URL does not use HTTPS');
        isPhishing = true;
      }
    }

    if (!isPhishing && content.length > 20) {
      threats.push('No threats detected');
    } else if (!isPhishing) {
      threats.push('Content too short to analyze');
    }

    const confidence = isPhishing ? Math.floor(Math.random() * 20) + 75 : Math.floor(Math.random() * 20) + 80;

    return {
      id: Date.now().toString(),
      type,
      content: content.substring(0, 100),
      isPhishing,
      confidence,
      threats,
      timestamp: new Date()
    };
  };

  const handleAnalyze = async () => {
    const content = activeTab === 'email' ? emailContent : urlContent;
    
    if (!content.trim()) {
      return;
    }

    setIsAnalyzing(true);
    const result = await analyzeContent(content, activeTab);
    setCurrentResult(result);
    setHistory(prev => [result, ...prev]);
    setIsAnalyzing(false);
  };

  const handleClear = () => {
    setEmailContent('');
    setUrlContent('');
    setCurrentResult(null);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // Calculate stats
  const totalScans = history.length;
  const threatsDetected = history.filter(h => h.isPhishing).length;
  const safeScans = history.filter(h => !h.isPhishing).length;
  const avgConfidence = history.length > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.confidence, 0) / history.length) 
    : 0;

  return (
    <div className="min-h-screen bg-[#121212] flex fixed inset-0 overflow-auto">
      {/* Sidebar Navigation */}
      <div className="w-20 bg-[#1a1a1a] flex flex-col items-center py-8 gap-8 shadow-[4px_0_12px_rgba(0,0,0,0.3)] flex-shrink-0">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="cursor-pointer"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-[#121212] flex items-center justify-center shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.03),inset_2px_2px_5px_rgba(0,0,0,0.5)]">
              <Shield className="w-6 h-6 text-[#00E5FF]" strokeWidth={2} />
            </div>
          </div>
        </motion.div>
        
        <div className="flex-1 flex flex-col gap-6 mt-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#1a1a1a] shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.02),inset_2px_2px_5px_rgba(0,0,0,0.4)]">
              <Activity className="w-5 h-5 text-[#00E5FF]" strokeWidth={2} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-white mb-2">AI Phishing Detection</h1>
              <p className="text-[#999]">Real-time threat analysis and security monitoring</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Scans', value: totalScans, color: '#00E5FF', icon: Activity },
              { label: 'Threats Detected', value: threatsDetected, color: '#FF1744', icon: AlertTriangle },
              { label: 'Safe Items', value: safeScans, color: '#76FF03', icon: CheckCircle },
              { label: 'Avg Confidence', value: `${avgConfidence}%`, color: '#FFEA00', icon: TrendingUp },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-[#1e1e1e] rounded-2xl p-5 shadow-[-4px_-4px_10px_rgba(255,255,255,0.02),4px_4px_10px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#999]">{stat.label}</span>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                      <stat.icon className="w-4 h-4" style={{ color: stat.color }} strokeWidth={2} />
                    </div>
                  </div>
                  <div className="text-white" style={{ color: '#fff' }}>
                    {stat.value}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-[#1e1e1e] rounded-2xl p-6 shadow-[-4px_-4px_10px_rgba(255,255,255,0.02),4px_4px_10px_rgba(0,0,0,0.5)]">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'email' | 'url')}>
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#121212] p-1.5 rounded-xl shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.02),inset_2px_2px_5px_rgba(0,0,0,0.5)]">
                    <TabsTrigger 
                      value="email" 
                      className="gap-2 rounded-lg data-[state=active]:bg-[#1e1e1e] data-[state=active]:shadow-[-2px_-2px_5px_rgba(255,255,255,0.02),2px_2px_5px_rgba(0,0,0,0.4)] data-[state=active]:text-[#00E5FF] text-[#666]"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger 
                      value="url" 
                      className="gap-2 rounded-lg data-[state=active]:bg-[#1e1e1e] data-[state=active]:shadow-[-2px_-2px_5px_rgba(255,255,255,0.02),2px_2px_5px_rgba(0,0,0,0.4)] data-[state=active]:text-[#00E5FF] text-[#666]"
                    >
                      <LinkIcon className="w-4 h-4" />
                      URL
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="email" className="space-y-4 mt-0">
                    <div>
                      <label className="block mb-3 text-[#999] flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                        Email Content
                      </label>
                      <Textarea
                        placeholder="Paste the suspicious email content here..."
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        className="min-h-[180px] resize-none bg-[#121212] border-0 text-[#e0e0e0] placeholder:text-[#555] rounded-xl shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.02),inset_3px_3px_7px_rgba(0,0,0,0.5)] focus-visible:ring-0"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="url" className="space-y-4 mt-0">
                    <div>
                      <label className="block mb-3 text-[#999] flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                        URL to Check
                      </label>
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        value={urlContent}
                        onChange={(e) => setUrlContent(e.target.value)}
                        className="border-0 bg-[#121212] text-[#e0e0e0] placeholder:text-[#555] h-14 rounded-xl shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.02),inset_3px_3px_7px_rgba(0,0,0,0.5)] focus-visible:ring-0"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-3 mt-6">
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || (activeTab === 'email' ? !emailContent.trim() : !urlContent.trim())}
                      className="w-full bg-[#00E5FF] hover:bg-[#00BCD4] text-[#121212] shadow-[-3px_-3px_8px_rgba(0,229,255,0.1),3px_3px_8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] h-12 rounded-xl border-0 disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Shield className="w-5 h-5 mr-2" />
                          Analyze Now
                        </>
                      )}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleClear}
                      disabled={isAnalyzing}
                      className="border-0 bg-[#1e1e1e] hover:bg-[#252525] text-[#999] h-12 px-6 rounded-xl shadow-[-2px_-2px_5px_rgba(255,255,255,0.02),2px_2px_5px_rgba(0,0,0,0.5)]"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Result Card */}
            <AnimatePresence mode="wait">
              {currentResult && (
                <motion.div
                  key={currentResult.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-[#1e1e1e] rounded-2xl p-6 shadow-[-4px_-4px_10px_rgba(255,255,255,0.02),4px_4px_10px_rgba(0,0,0,0.5)]">
                    <div className="flex items-start gap-5">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="flex-shrink-0"
                      >
                        <div 
                          className="w-14 h-14 rounded-xl flex items-center justify-center shadow-[-3px_-3px_8px_rgba(255,255,255,0.02),3px_3px_8px_rgba(0,0,0,0.5)]"
                          style={{ backgroundColor: currentResult.isPhishing ? '#FF174415' : '#76FF0315' }}
                        >
                          {currentResult.isPhishing ? (
                            <AlertTriangle className="w-7 h-7 text-[#FF1744]" strokeWidth={2} />
                          ) : (
                            <CheckCircle className="w-7 h-7 text-[#76FF03]" strokeWidth={2} />
                          )}
                        </div>
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-white">
                            {currentResult.isPhishing ? 'Phishing Detected' : 'Appears Safe'}
                          </h3>
                          <div 
                            className="px-4 py-1.5 rounded-full text-sm shadow-[-2px_-2px_5px_rgba(255,255,255,0.02),2px_2px_5px_rgba(0,0,0,0.4)]"
                            style={{ 
                              backgroundColor: currentResult.isPhishing ? '#FF174415' : '#76FF0315',
                              color: currentResult.isPhishing ? '#FF1744' : '#76FF03'
                            }}
                          >
                            {currentResult.confidence}% Confidence
                          </div>
                        </div>
                        <p className="text-[#999] mb-5">
                          {currentResult.isPhishing
                            ? 'This content shows signs of a phishing attempt. Exercise caution and do not click any links or provide personal information.'
                            : 'No significant phishing indicators detected. However, always stay vigilant when handling emails and URLs.'}
                        </p>
                        <div className="bg-[#121212] rounded-xl p-4 shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.02),inset_2px_2px_5px_rgba(0,0,0,0.5)]">
                          <p className="text-[#999] mb-3">Analysis Results</p>
                          <ul className="space-y-2">
                            {currentResult.threats.map((threat, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="flex items-start gap-3 text-[#e0e0e0]"
                              >
                                <div 
                                  className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                                  style={{ backgroundColor: currentResult.isPhishing ? '#FF1744' : '#76FF03' }}
                                />
                                <span>{threat}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - History (1/3 width) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-[#1e1e1e] rounded-2xl p-6 shadow-[-4px_-4px_10px_rgba(255,255,255,0.02),4px_4px_10px_rgba(0,0,0,0.5)] flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#FFEA0015]">
                    <Clock className="w-5 h-5 text-[#FFEA00]" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-white">History</h3>
                    {history.length > 0 && (
                      <span className="text-[#999] text-sm">{history.length} scans</span>
                    )}
                  </div>
                </div>
                {history.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="hover:bg-[#252525] text-[#999] hover:text-[#FF1744] rounded-lg h-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-[#121212] flex items-center justify-center mb-4 shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.02),inset_2px_2px_5px_rgba(0,0,0,0.5)]">
                    <Shield className="w-8 h-8 text-[#555]" strokeWidth={2} />
                  </div>
                  <p className="text-[#666] mb-1">No scans yet</p>
                  <p className="text-[#444]">Start analyzing content</p>
                </div>
              ) : (
                <ScrollArea className="h-[450px] -mr-3 pr-3">
                  <div className="space-y-3">
                    {history.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: -3 }}
                      >
                        <div className="bg-[#121212] rounded-xl p-4 shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.02),inset_2px_2px_5px_rgba(0,0,0,0.5)]">
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: item.isPhishing ? '#FF174415' : '#76FF0315' }}
                            >
                              {item.isPhishing ? (
                                <AlertTriangle className="w-4 h-4 text-[#FF1744]" strokeWidth={2} />
                              ) : (
                                <CheckCircle className="w-4 h-4 text-[#76FF03]" strokeWidth={2} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <div 
                                  className="px-2 py-0.5 rounded-md text-xs"
                                  style={{ backgroundColor: '#00E5FF15', color: '#00E5FF' }}
                                >
                                  {item.type.toUpperCase()}
                                </div>
                                <div 
                                  className="px-2 py-0.5 rounded-md text-xs"
                                  style={{ 
                                    backgroundColor: item.isPhishing ? '#FF174415' : '#76FF0315',
                                    color: item.isPhishing ? '#FF1744' : '#76FF03'
                                  }}
                                >
                                  {item.confidence}%
                                </div>
                              </div>
                              <p className="text-[#e0e0e0] text-sm truncate mb-2">
                                {item.content}
                              </p>
                              <div className="flex items-center gap-2 text-[#666] text-xs">
                                <Clock className="w-3 h-3" />
                                {item.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
