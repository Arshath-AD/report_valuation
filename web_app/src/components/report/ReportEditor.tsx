import { useState, useEffect } from 'react';
import { Calculator, CheckCircle, ChevronLeft, FileText, Gavel, LayoutList, MapPin, MessageSquare, Plus, Save, Sparkles, Building2 } from 'lucide-react';
import { ValuationReport } from '../../types';
import { formatDate } from '../../utils/formatDate';

interface ReportEditorProps {
    report: ValuationReport | null;
    onBack: () => void;
    onSave: (reportId: string, content: ValuationReport['content']) => void;
    onApprove: (reportId: string) => void;
}

export default function ReportEditor({ report, onBack, onSave, onApprove }: ReportEditorProps) {
    const [content, setContent] = useState(report?.content || {
        summary: '',
        propertyDetails: '',
        valuationMethod: '',
        finalValuation: '',
    });
    const [activeSection, setActiveSection] = useState<keyof typeof content>('summary');

    // Sync content when report data is loaded asynchronously
    useEffect(() => {
        if (report?.content) {
            setContent(report.content);
        }
    }, [report?.id, report?.content?.summary]);
    const [showComments, setShowComments] = useState(false);

    if (!report) {
        return (
            <div className="p-8">
                <div className="bg-white border border-secondary-200 rounded-lg p-12 text-center">
                    <p className="text-secondary-600">Select a report to edit</p>
                </div>
            </div>
        );
    }

    const sections = [
        { key: 'summary' as const, label: 'Summary', icon: <Sparkles size={16} /> },
        { key: 'propertyDetails' as const, label: 'Property Details', icon: <Sparkles size={16} /> },
        { key: 'valuationMethod' as const, label: 'Valuation Method', icon: <Sparkles size={16} /> },
        { key: 'finalValuation' as const, label: 'Final Valuation', icon: <Sparkles size={16} /> },
    ];

    const handleSectionUpdate = (section: keyof typeof content, value: string) => {
        setContent((prev) => ({ ...prev, [section]: value }));
    };

    const handleSave = () => {
        onSave(report.id, content);
    };



    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft':
                return 'bg-amber-900/30 text-amber-400 border border-amber-800/50';
            case 'review':
                return 'bg-orange-900/30 text-orange-400 border border-orange-800/50';
            case 'approved':
                return 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50';
            default:
                return 'bg-slate-800 text-slate-300 border border-slate-700/50';
        }
    };

    return (
        <div className="h-full p-4 sm:p-6 flex flex-col overflow-hidden max-w-[1600px] w-full mx-auto">
            <div className="flex-1 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
                <div className="bg-transparent border-b border-slate-700/30 px-8 py-6 z-20">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold"
                        >
                            <ChevronLeft size={20} />
                            <span className="font-medium">Back</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowComments(!showComments)}
                                className="flex items-center gap-2 px-4 py-2 border border-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                            >
                                <MessageSquare size={18} />
                                <span className="font-medium">Comments ({report.comments.length})</span>
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-4 py-2 border border-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                            >
                                <Save size={18} />
                                <span className="font-medium">Save Draft</span>
                            </button>
                            <button
                                id="approve-report-btn"
                                onClick={() => onApprove(report.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600/90 hover:bg-emerald-500 text-white border border-emerald-500/50 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-[0.98]"
                            >
                                <CheckCircle size={18} />
                                <span className="font-medium">Approve</span>
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-white">{report.customerName}</h1>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(report.status)}`}>
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-400 font-medium">
                            <span>{report.bankName}</span>
                            <span>•</span>
                            <span>{report.propertyType}</span>
                            <span>•</span>
                            <span>{report.location}</span>
                            <span>•</span>
                            <span>Updated {formatDate(report.updatedAt, 'short')}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden relative z-0">
                    <div className="w-64 bg-transparent border-r border-slate-700/30 p-4 overflow-auto z-10">
                        <h3 className="text-sm font-semibold text-slate-400 mb-3">Report Sections</h3>
                        <div className="space-y-1">
                            {sections.map((section) => (
                                <button
                                    key={section.key}
                                    onClick={() => setActiveSection(section.key)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeSection === section.key
                                        ? 'bg-brand-500/10 text-brand-400 font-medium border border-brand-500/20'
                                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300 border border-transparent'
                                        }`}
                                >
                                    {section.icon}
                                    <span className="text-sm">{section.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto bg-transparent">
                        <div className="max-w-4xl mx-auto p-8 h-full flex flex-col">
                            <div className="bg-brand-500/10 border border-brand-500/20 rounded-lg p-4 mb-6 flex items-start gap-3 backdrop-blur-sm shrink-0">
                                <Sparkles size={20} className="text-brand-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-brand-300">AI-Generated Content</p>
                                    <p className="text-sm text-brand-400/80 mt-1">
                                        This section was created by AI. Review and edit as needed for accuracy.
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 bg-transparent rounded-xl flex flex-col min-h-[500px]">
                                <div className="px-6 py-4 flex-shrink-0 z-10">
                                    <h2 className="text-xl font-bold text-white mb-2 pb-2 border-b border-slate-700/30">
                                        {sections.find((s) => s.key === activeSection)?.label}
                                    </h2>
                                </div>
                                <textarea
                                    value={content[activeSection]}
                                    onChange={(e) => handleSectionUpdate(activeSection, e.target.value)}
                                    className="w-full flex-1 p-6 pt-0 bg-slate-800/20 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none resize-none font-mono text-sm text-slate-300 placeholder-slate-500 shadow-inner min-h-[400px]"
                                    placeholder={`Enter ${sections.find((s) => s.key === activeSection)?.label.toLowerCase()}...`}
                                />
                            </div>
                        </div>
                    </div>

                    {showComments && (
                        <div className="w-80 bg-slate-900/30 border-l border-slate-700/30 overflow-auto z-10 flex flex-col">
                            <div className="p-5 border-b border-slate-700/30 bg-transparent">
                                <h3 className="font-semibold text-white">Comments</h3>
                            </div>
                            <div className="p-4 space-y-4 flex-1 overflow-auto">
                                {report.comments.length === 0 ? (
                                    <p className="text-sm text-slate-500 text-center py-8">No comments yet</p>
                                ) : (
                                    report.comments.map((comment) => (
                                        <div key={comment.id} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-sm text-slate-200">{comment.user}</span>
                                                {comment.resolved && (
                                                    <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">Resolved</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-300">{comment.text}</p>
                                            <p className="text-xs text-slate-500 mt-2">
                                                {formatDate(comment.timestamp, 'datetime')}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-5 border-t border-slate-700/30 bg-transparent mx-0 mt-auto">
                                <textarea
                                    placeholder="Add a comment..."
                                    className="w-full p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none resize-none shadow-sm"
                                    rows={3}
                                />
                                <button className="w-full mt-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-500 transition-colors text-sm font-medium">
                                    Post Comment
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
