import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PalmFeatures } from '../types';
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  Activity,
  ScanLine
} from 'lucide-react';

import { ExpertCtaBanner } from './ExpertCtaBanner';

interface PalmScannerProps {
  onPalmAnalyzed: (features: PalmFeatures, imageBase64: string) => void;
  userAgeGroup?: string;
  userGoals?: string[];
  trialsLeft?: number;
  onTalkToExpert?: (artifactLabel: string) => void;
}

export const PalmScanner: React.FC<PalmScannerProps> = ({
  onPalmAnalyzed,
  userAgeGroup,
  userGoals,
  trialsLeft = 2,
  onTalkToExpert
}) => {
  const [currentImageBase64, setCurrentImageBase64] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [handSide, setHandSide] = useState<'Right Hand' | 'Left Hand'>('Left Hand');
  const [showContrastFilter, setShowContrastFilter] = useState<boolean>(false);
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [currentAnalysis, setCurrentAnalysis] = useState<PalmFeatures | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const redrawStaticCanvas = useCallback(() => {
    if (!currentImageBase64) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentImageBase64;

    img.onload = () => {
      canvas.width = img.width || 640;
      canvas.height = img.height || 640;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (showContrastFilter) {
        ctx.filter = 'contrast(1.35) saturate(1.2) brightness(0.95)';
      } else {
        ctx.filter = 'none';
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';
    };
  }, [currentImageBase64, showContrastFilter]);

  useEffect(() => {
    redrawStaticCanvas();
  }, [redrawStaticCanvas]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          setCurrentImageBase64(base64);
          triggerPalmAnalysis(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access was not granted or is unavailable.');
      setIsCameraActive(false);
    }
  };

  const captureCameraPhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 640;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (isMirrored) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setCurrentImageBase64(dataUrl);

        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setIsCameraActive(false);
        triggerPalmAnalysis(dataUrl);
      }
    }
  };

  const triggerPalmAnalysis = async (imgBase64: string) => {
    setIsProcessing(true);
    setProcessingStage('Analyzing Palm Features...');
    setCurrentAnalysis(null);

    try {
      const res = await fetch('/api/palm/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imgBase64,
          handSide,
          userAge: userAgeGroup || '25-34',
          userGoals: userGoals || ['Career', 'Spiritual Growth']
        })
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        if (data.analysis.detectedHandSide) {
          setHandSide(data.analysis.detectedHandSide);
        }

        const resultAnalysis: PalmFeatures = {
          handType: data.analysis.handType || 'Fire',
          lifeLine: {
            name: 'Life Line',
            length: 'Long',
            quality: 'Clear',
            interpretation: data.analysis.lifeLineInterpretation || 'The Life Line reflects strong vitality, emotional grounding, and resilience.',
            confidence: 0.94
          },
          headLine: {
            name: 'Head Line',
            length: 'Long',
            quality: 'Clear',
            interpretation: data.analysis.headLineInterpretation || 'The head line shows practical wisdom, sharp discernment, and structured logic.',
            confidence: 0.92
          },
          heartLine: {
            name: 'Heart Line',
            length: 'Long',
            quality: 'Clear',
            interpretation: data.analysis.heartLineInterpretation || 'The heart line reflects emotional warmth, genuine empathy, and deep interpersonal loyalty.',
            confidence: 0.90
          },
          fateLine: {
            name: 'Fate Line',
            length: 'Medium',
            quality: 'Clear',
            interpretation: data.analysis.fateLineInterpretation || 'A steadfast fate line signifies strong self-determination and focused career goals.',
            confidence: 0.88
          },
          sunLine: {
            name: 'Sun Line (Apollo)',
            length: 'Medium',
            quality: 'Clear',
            interpretation: data.analysis.sunLineInterpretation || 'A clear Sun Line indicates creative spark, public recognition, and personal fulfillment.',
            confidence: 0.86
          },
          fingerStructure: { thumbFlexibility: 'Flexible', indexLength: 'Long & Straight', ringToIndexRatio: '1:1 Balanced' },
          mounts: { venus: data.analysis.mountsSummary || 'Well Developed', jupiter: 'Prominent', saturn: 'Normal', apollo: 'Elevated' },
          detectionConfidence: data.analysis.confidence || 0.94,
          landmarksCount: 5,
          overviewSummary: data.analysis.overviewSummary || 'Comprehensive palm analysis overview based on scanned hand geometry.'
        };

        setCurrentAnalysis(resultAnalysis);
        onPalmAnalyzed(resultAnalysis, imgBase64);
      }
    } catch (err) {
      console.error('[PalmScanner] Palm analysis error:', err);
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header Banner */}
      <div className="bg-[#0A0A0F] rounded-2xl p-6 border border-white/10 shadow-2xl text-[#E0E0E6] text-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <div className="flex items-center justify-center space-x-2 text-violet-400 font-mono text-[10px] tracking-[0.25em] uppercase mb-1">
            <ScanLine className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Palm Vision Engine • Hand Analysis Studio</span>
          </div>
          <h2 className="text-2xl font-light text-white italic serif">
            Palmistry <span className="font-bold not-italic">Scanner</span>
          </h2>
          <p className="text-xs text-white/50 mt-1 leading-relaxed">
            Upload any hand photo or snap from your webcam for comprehensive palmistry and character analysis.
          </p>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-6 space-y-4">
          
          <div className="relative bg-[#0A0A0F] border border-white/10 rounded-2xl p-4 overflow-hidden flex flex-col items-center justify-center min-h-[480px] text-[#E0E0E6]">
            
            {isCameraActive ? (
              <div className="relative w-full max-w-md flex flex-col items-center">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-violet-500/50 shadow-2xl bg-black flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{ transform: isMirrored ? 'scaleX(-1)' : 'none' }}
                    className="w-full h-full object-cover rounded-xl"
                  />

                  <motion.div
                    initial={{ top: '0%' }}
                    animate={{ top: ['5%', '90%', '5%'] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent shadow-[0_0_18px_#8B5CF6] pointer-events-none z-20"
                  />

                  <button
                    onClick={() => setIsMirrored(!isMirrored)}
                    className="absolute top-3 right-3 text-[10px] font-mono text-white bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded transition-colors z-20"
                  >
                    {isMirrored ? 'Mirror: ON' : 'Mirror: OFF'}
                  </button>
                </div>

                <div className="mt-3 flex gap-2 w-full">
                  <button
                    onClick={captureCameraPhoto}
                    className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold uppercase tracking-[0.2em] text-xs rounded-xl sleek-glow-violet transition-all flex items-center justify-center space-x-2"
                  >
                    <Camera className="w-4 h-4 text-amber-300" />
                    <span>Capture Hand Photo</span>
                  </button>
                  <button
                    onClick={() => {
                      const video = videoRef.current;
                      if (video && video.srcObject) {
                        const stream = video.srcObject as MediaStream;
                        stream.getTracks().forEach(t => t.stop());
                      }
                      setIsCameraActive(false);
                    }}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : currentImageBase64 ? (
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center bg-[#050507] rounded-xl overflow-hidden border border-white/10">
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full object-contain rounded-xl" 
                />

                <motion.div 
                  initial={{ top: '0%' }}
                  animate={{ top: ['5%', '90%', '5%'] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent shadow-[0_0_18px_#8B5CF6] pointer-events-none z-10"
                />

                <div className="absolute top-3 left-3 text-[10px] font-mono text-amber-400 bg-black/85 backdrop-blur-md border border-amber-500/40 px-2.5 py-1 rounded flex items-center space-x-1.5 z-20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>HAND PHOTO LOADED</span>
                </div>

                {isProcessing && (
                  <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
                    <RefreshCw className="w-10 h-10 text-violet-400 animate-spin mb-3" />
                    <div className="text-xs font-mono uppercase tracking-widest text-white">{processingStage}</div>
                    <div className="w-48 bg-white/10 h-1 rounded-full mt-4 overflow-hidden">
                      <div className="bg-gradient-to-r from-violet-500 to-amber-400 h-full animate-pulse w-3/4"></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full max-w-md py-12 px-6 flex flex-col items-center text-center space-y-5 bg-[#050507] border border-white/10 rounded-2xl">
                <div className="w-20 h-20 rounded-full bg-violet-600/10 border border-violet-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                  <ScanLine className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Present Your Palm</h3>
                  <p className="text-xs text-white/50 max-w-xs mt-1 leading-relaxed">
                    Capture your palm using your webcam or upload a clear photo of your hand to run AI palmistry analysis.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                  <button
                    onClick={startCamera}
                    className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold uppercase tracking-wider text-xs rounded-xl sleek-glow-violet transition-all flex items-center justify-center space-x-2"
                  >
                    <Camera className="w-4 h-4 text-amber-300" />
                    <span>Open Camera</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold uppercase tracking-wider text-xs rounded-xl border border-white/10 transition-all flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-4 h-4 text-violet-400" />
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>
            )}

            {currentImageBase64 && !isCameraActive && (
              <div className="w-full mt-4 flex items-center justify-between px-2 text-xs text-white/80 border-t border-white/5 pt-3">
                <label className="flex items-center space-x-1.5 cursor-pointer text-xs hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={showContrastFilter}
                    onChange={(e) => setShowContrastFilter(e.target.checked)}
                    className="rounded bg-black border-white/20 text-cyan-400 focus:ring-0"
                  />
                  <span>Contrast Enhancement Filter</span>
                </label>

                <button
                  onClick={() => {
                    setCurrentImageBase64(null);
                    setCurrentAnalysis(null);
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 transition-colors font-mono"
                >
                  Clear Photo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Analysis Insights Summary */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 text-[#E0E0E6] space-y-6">
            <h3 className="text-lg font-light text-white italic serif border-b border-white/10 pb-3 flex items-center justify-between">
              <span>Palmistry Analysis Report</span>
              {currentAnalysis && (
                <span className="text-xs font-mono text-emerald-400 not-italic bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded">
                  Analysis Complete
                </span>
              )}
            </h3>

            {currentAnalysis ? (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <p className="text-[10px] font-mono text-violet-400 uppercase tracking-widest">Hand Archetype</p>
                  <p className="text-base font-bold text-white">{currentAnalysis.handType} Hand</p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                    <p className="font-semibold text-rose-400">Life Line (Vitality)</p>
                    <p className="text-white/70 leading-relaxed">{currentAnalysis.lifeLine.interpretation}</p>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                    <p className="font-semibold text-sky-400">Head Line (Intellect)</p>
                    <p className="text-white/70 leading-relaxed">{currentAnalysis.headLine.interpretation}</p>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                    <p className="font-semibold text-pink-400">Heart Line (Emotion)</p>
                    <p className="text-white/70 leading-relaxed">{currentAnalysis.heartLine.interpretation}</p>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                    <p className="font-semibold text-purple-400">Fate Line (Destiny)</p>
                    <p className="text-white/70 leading-relaxed">{currentAnalysis.fateLine.interpretation}</p>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                    <p className="font-semibold text-amber-400">Sun Line (Apollo & Creativity)</p>
                    <p className="text-white/70 leading-relaxed">{currentAnalysis.sunLine.interpretation}</p>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                    <p className="font-semibold text-emerald-400">Palm Mounts & Energy Centers</p>
                    <p className="text-white/70 leading-relaxed">{currentAnalysis.mounts.venus}</p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-violet-950/60 to-indigo-950/60 rounded-xl border border-violet-500/30 space-y-1.5 mt-4">
                    <p className="font-mono text-[11px] text-amber-400 uppercase tracking-widest font-bold">Overview of Palm Analysis</p>
                    <p className="text-white/85 leading-relaxed text-xs">{currentAnalysis.overviewSummary}</p>
                  </div>

                  {onTalkToExpert && (
                    <ExpertCtaBanner
                      trialsLeft={trialsLeft}
                      contextLabel="palm reading"
                      onTalkToExpert={() => onTalkToExpert(`${currentAnalysis.handType} palm scan`)}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center space-y-3 text-white/50">
                <Activity className="w-8 h-8 mx-auto text-violet-400/50 animate-pulse" />
                <p className="text-xs">Upload or snap a photo of your hand to generate your complete AI palmistry report.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
