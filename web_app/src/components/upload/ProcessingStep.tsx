import { useState } from 'react';
import { CheckCircle2, Copy, Home, FileText } from 'lucide-react';
import { UploadedFile } from './types';

interface ProcessingStepProps {
    files: UploadedFile[];
    selectedFiles: string[];
    progress?: { completed: number; total: number; percentage: number };
    onCopyLink?: () => Promise<boolean | void>;
    onGoHome?: () => void;
}

export default function ProcessingStep({
    files,
    selectedFiles,
    progress,
    onCopyLink,
    onGoHome,
}: ProcessingStepProps) {
    const pct = progress ? Math.round(progress.percentage) : 0;
    const done = progress?.completed ?? 0;
    const total = progress?.total ?? selectedFiles.length;

    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!onCopyLink) return;
        const ok = await onCopyLink();
        if (ok !== false) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl shadow-brand-950/40 p-8 text-center relative overflow-hidden">
                {/* Animated top gradient bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 via-brand-500 to-violet-500 animate-pulse" />

                {/* Background glow blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none translate-x-12 translate-y-12" />

                <div className="relative z-10 pt-4">
                    {/* Cool multi-ring violet pulse loader */}
                    <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
                        {/* Outermost ring */}
                        <span className="absolute inset-0 rounded-full border-2 border-brand-500/20 animate-ping" style={{ animationDuration: '2s' }} />
                        {/* Middle ring */}
                        <span className="absolute inset-2 rounded-full border-2 border-brand-500/30 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }} />
                        {/* Inner ring spinning */}
                        <span className="absolute inset-4 rounded-full border-2 border-t-brand-400 border-brand-500/20 animate-spin" style={{ animationDuration: '1.2s' }} />
                        {/* Core icon */}
                        <div className="relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500/30 to-brand-700/30 backdrop-blur-sm border border-brand-400/30 flex items-center justify-center shadow-lg shadow-brand-900/40">
                            <div className="w-3 h-3 rounded-full bg-brand-400 animate-pulse" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Processing Documents</h2>
                    <p className="text-white/50 text-sm mb-6 max-w-md mx-auto font-medium">
                        Our AI is analyzing{' '}
                        <span className="font-bold text-brand-300 underline decoration-brand-500/40 decoration-2 underline-offset-4">
                            {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'}
                        </span>
                        . This might take a moment.
                    </p>

                    {/* Progress bar */}
                    <div className="mb-6 space-y-2">
                        <div className="flex justify-between text-xs font-bold text-white/30 uppercase tracking-widest">
                            <span>{done} of {total} files</span>
                            <span>{pct}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden relative">
                            <div
                                className="h-full bg-gradient-to-r from-brand-500 to-violet-500 rounded-full transition-all duration-1000 ease-out relative"
                                style={{ width: `${pct || 5}%` }}
                            >
                                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md shadow-brand-500" />
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <button
                            id="processing-copy-link-btn"
                            onClick={handleCopy}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-semibold hover:scale-[1.03] transition-all duration-200 text-sm ${copied
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                : 'border-white/15 text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {copied ? (
                                <>
                                    <CheckCircle2 size={15} />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy size={15} />
                                    Copy Link
                                </>
                            )}
                        </button>

                        <button
                            id="processing-go-home-btn"
                            onClick={onGoHome}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-white/70 font-semibold hover:bg-white/10 hover:text-white hover:scale-[1.03] transition-all duration-200 text-sm"
                        >
                            <Home size={15} />
                            Go to Home
                        </button>
                    </div>
                </div>

                {/* Per-file list */}
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 scrollbar-hide py-2">
                    {files
                        .filter((f) => selectedFiles.includes(f.id))
                        .map((file, index) => (
                            <div
                                key={file.id}
                                className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-4 transition-all"
                                style={{
                                    animation: `fadeInUp 0.5s ease-out forwards ${index * 0.1}s`,
                                    opacity: 0
                                }}
                            >
                                <div className="p-2 bg-brand-900/40 border border-brand-500/20 rounded-lg flex-shrink-0">
                                    {file.progress >= 100
                                        ? <CheckCircle2 size={16} className="text-emerald-400" />
                                        : <FileText size={16} className="text-brand-400 animate-pulse" />
                                    }
                                </div>

                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-sm font-semibold text-white truncate tracking-tight">
                                            {file.name || file.file?.name}
                                        </h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider flex-shrink-0 ml-2 ${file.progress >= 100
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                            : 'bg-brand-900/40 border-brand-500/20 text-brand-400'
                                            }`}>
                                            {file.progress >= 100 ? 'Done' : 'Analyzing'}
                                        </span>
                                    </div>

                                    <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-brand-500 to-violet-500 h-full rounded-full transition-all duration-700 ease-in-out"
                                            style={{ width: `${file.progress ?? 40}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            <p className="text-center text-xs font-bold text-white/30 uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                <span className="w-2 h-2 bg-brand-500 rounded-full shrink-0 animate-pulse" />
                Processing is active — The wizard will auto-advance when done
            </p>
        </div>
    );
}
