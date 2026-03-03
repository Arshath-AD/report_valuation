import { FileText, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { useReports } from '../../hooks/useReports';
import { ApiReport } from '../../apis/report.api';

interface ReportsSidebarProps {
    selectedReportId: string | null;
    onReportSelect: (reportId: string) => void;
}

export default function ReportsSidebar({ selectedReportId, onReportSelect }: ReportsSidebarProps) {
    const { data: reportsData, isLoading } = useReports();

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-brand-600" size={32} />
            </div>
        );
    }

    const reports = reportsData?.reports || [];

    return (
        <div className="h-full bg-slate-900/40 backdrop-blur-xl border-r border-slate-700/50 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50 bg-slate-800/40">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
                    <FileText size={24} className="text-brand-400" />
                    All Reports
                </h2>
                <p className="text-slate-400 text-sm mt-1 font-medium">
                    {reports.length} {reports.length === 1 ? 'report' : 'reports'} available
                </p>
            </div>

            {/* Reports List */}
            <div className="flex-1 overflow-y-auto">
                {reports.length === 0 ? (
                    <div className="p-6 text-center">
                        <FileText className="mx-auto text-slate-500 mb-3" size={48} />
                        <p className="text-slate-400 font-medium">No reports yet</p>
                        <p className="text-slate-500 text-sm mt-1">Create your first report to get started</p>
                    </div>
                ) : (
                    <div className="p-4 space-y-2">
                        {reports.map((report: ApiReport) => {
                            const status = (report as any).report_status ?? (report as any).status ?? 'draft';

                            const badgeClass =
                                status === 'approved'
                                    ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50'
                                    : status === 'review'
                                        ? 'bg-orange-900/30 text-orange-400 border border-orange-800/50'
                                        : 'bg-slate-800 text-slate-300 border border-slate-700/50';

                            return (
                                <button
                                    key={report.id}
                                    onClick={() => onReportSelect(report.id)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all group hover:shadow-lg ${selectedReportId === report.id
                                        ? 'border-brand-500 bg-slate-800/80 shadow-md'
                                        : 'border-slate-700/50 hover:border-brand-500/50 bg-slate-900/60'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <h3
                                                className={`font-semibold truncate ${selectedReportId === report.id
                                                    ? 'text-brand-400'
                                                    : 'text-white group-hover:text-brand-300'
                                                    }`}
                                            >
                                                {report.report_name || report.name}
                                            </h3>

                                            {report.bank_name && (
                                                <p className="text-sm text-slate-400 mt-1 truncate">{report.bank_name}</p>
                                            )}

                                            <div className="flex items-center gap-2 mt-2">
                                                <Calendar size={14} className="text-slate-500" />
                                                <span className="text-xs text-slate-400">{formatDate(report.created_at)}</span>
                                            </div>

                                            <div className="mt-2">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
                                                    {String(status).charAt(0).toUpperCase() + String(status).slice(1)}
                                                </span>
                                            </div>
                                        </div>

                                        <ChevronRight
                                            size={20}
                                            className={`flex-shrink-0 transition-transform ${selectedReportId === report.id
                                                ? 'text-brand-400 translate-x-1'
                                                : 'text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1'
                                                }`}
                                        />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}