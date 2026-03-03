import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  Clock,
  ChevronLeft,
  History,
} from 'lucide-react';

import { ValuationReport, ReportStatus } from '../types';
import { formatDate } from '../utils/formatDate';
import { useReport, useUpdateReport } from '../hooks/useReports';
import { mapApiReportToValuation } from '../utils/reportMapper';
import Loader from '../components/common/Loader';

export default function ReviewApprovalPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [showAuditTrail, setShowAuditTrail] = useState(false);

  const { data: apiData, isLoading, error } = useReport(id);
  const updateReportMutation = useUpdateReport();

  const report = apiData ? mapApiReportToValuation(apiData) : null;

  const handleBack = () => {
    navigate('/');
  };

  const handleStatusChange = async (reportId: string, status: ReportStatus) => {
    try {
      await updateReportMutation.mutateAsync({
        reportId,
        data: { report_status: status }
      });
    } catch (e) {
      console.error("Failed to update status", e);
      alert("Failed to update report status.");
    }
  };

  const handleExport = (reportId: string, format: 'pdf' | 'docx') => {
    if (report) {
      alert(`Exporting ${report.customerName}'s report as ${format.toUpperCase()}`);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!report) {
    return (
      <div className="p-8">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-lg p-12 text-center">
          <p className="text-slate-400">Report not found</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-amber-900/30 text-amber-400 border-amber-800/50';
      case 'review':
        return 'bg-orange-900/30 text-orange-400 border-orange-800/50';
      case 'approved':
        return 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700/50';
    }
  };

  const statusWorkflow: { status: ReportStatus; label: string; icon: JSX.Element }[] = [
    { status: 'draft', label: 'Draft', icon: <Clock size={16} /> },
    { status: 'review', label: 'Under Review', icon: <FileText size={16} /> },
    { status: 'approved', label: 'Approved', icon: <CheckCircle size={16} /> },
  ];

  return (
    <div className="h-screen flex flex-col p-4 sm:p-6 overflow-hidden max-w-7xl mx-auto w-full">
      <div className="flex-1 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="bg-slate-800/30 border-b border-slate-700/50 px-10 py-8 z-20">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-3 text-slate-400 hover:text-brand-400 font-bold transition-all hover:-translate-x-1"
            >
              <ChevronLeft size={28} />
              <span className="text-lg">Back to Dashboard</span>
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAuditTrail(!showAuditTrail)}
                className="flex items-center gap-3 px-6 py-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl hover:bg-slate-800 hover:text-white transition-all font-bold text-slate-300 shadow-sm hover:shadow"
              >
                <History size={22} />
                Audit Trail
              </button>

              <button
                onClick={() => handleExport(report.id, 'pdf')}
                className="px-6 py-3 bg-brand-500/10 text-brand-400 border border-brand-500/30 rounded-2xl hover:bg-brand-500/20 hover:text-brand-300 transition-all font-bold shadow-sm hover:shadow"
              >
                Export PDF
              </button>
              <button
                onClick={() => handleExport(report.id, 'docx')}
                className="px-6 py-3 bg-brand-500/10 text-brand-400 border border-brand-500/30 rounded-2xl hover:bg-brand-500/20 hover:text-brand-300 transition-all font-bold shadow-sm hover:shadow"
              >
                Export DOCX
              </button>
            </div>
          </div>

          <h1 className="text-4xl font-black text-white tracking-tight">{report.customerName}</h1>
          <div className="flex items-center gap-5 mt-3 text-sm font-bold text-slate-400">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
              {report.bankName}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span>{report.propertyType}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span>{report.location}</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden relative z-0">
          <div className="flex-1 overflow-auto bg-transparent p-8">
            <div className="bg-slate-800/20 border border-slate-700/30 rounded-2xl p-6 mb-8 shadow-inner">
              <h2 className="text-xl font-black text-white mb-6 border-b border-slate-700/30 pb-3">Report Status</h2>

              <div className="flex justify-between items-center mb-8 gap-3">
                {statusWorkflow.map((item, index) => (
                  <div key={item.status} className="flex items-center flex-1 last:flex-none">
                    <button
                      onClick={() => handleStatusChange(report.id, item.status)}
                      className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-all font-black text-sm shadow-sm
                      ${report.status === item.status
                          ? getStatusColor(item.status) + ' shadow-md'
                          : 'border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-600'
                        }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                    {index < statusWorkflow.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-4 transition-colors ${statusWorkflow.findIndex(i => i.status === report.status) >= index
                        ? 'bg-brand-500 shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                        : 'bg-slate-800/80'
                        }`} />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-400 font-bold bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50 inline-flex">
                <Clock size={16} />
                <span>Last Updated:</span>
                <span className="text-slate-300">{formatDate(report.updatedAt, 'long')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
