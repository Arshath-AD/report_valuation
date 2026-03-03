import {
    FileText,
    Download,
    Eye,
    Trash2,
    Folder,
    GripVertical
} from 'lucide-react';
import { ReportFile } from '../../../types';
import { formatDate } from '../../../utils/formatDate';

interface FileListProps {
    files: ReportFile[];
    viewMode: 'grid' | 'list';
    onPreview: (file: ReportFile) => void;
    onDownload: (file: ReportFile) => void;
    onDelete?: (file: ReportFile) => void;
    /** Called when a drag starts — pass the file being dragged up to parent */
    onDragStart?: (file: ReportFile) => void;
}

export default function FileList({
    files,
    viewMode,
    onPreview,
    onDownload,
    onDelete,
    onDragStart
}: FileListProps) {

    if (files.length === 0) {
        return (
            <div className="bg-transparent border border-slate-700/50 border-dashed rounded-lg p-12 text-center h-full flex flex-col items-center justify-center">
                <Folder size={48} className="mx-auto text-slate-500 mb-4" />
                <p className="text-slate-400">Select a folder to view files</p>
            </div>
        );
    }

    const handleDragStart = (e: React.DragEvent, file: ReportFile) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('fileId', file.id);
        e.dataTransfer.setData('fileName', file.name);
        onDragStart?.(file);
    };

    return (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1" : "flex flex-col gap-4"}>
            {files.map((file) => {
                if (!file) return null;

                if (viewMode === 'grid') {
                    return (
                        <div
                            key={file.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, file)}
                            className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-brand-500/50 transition-all shadow-xl hover:shadow-2xl flex flex-col h-full relative group cursor-grab active:cursor-grabbing active:opacity-60 active:scale-95 active:shadow-lg active:ring-2 active:ring-brand-500"
                        >
                            {/* Drag handle indicator */}
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-40 transition-opacity">
                                <GripVertical size={16} className="text-slate-500" />
                            </div>

                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-brand-400 group-hover:bg-slate-700 transition-colors border border-slate-700/50">
                                    <FileText size={24} />
                                </div>
                                <div className="bg-slate-800 px-2 py-1 rounded text-xs font-medium text-slate-300 border border-slate-700/50">
                                    {file.type ? file.type.toUpperCase() : 'FILE'}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0 mb-4">
                                <h3 className="font-bold text-white truncate mb-1" title={file.name}>
                                    {file.name}
                                </h3>
                                <p className="text-sm text-slate-400">
                                    {file.size} • {formatDate(file.uploadedAt, 'short')}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-slate-700/50 mt-auto">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPreview(file);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-brand-300 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg transition-colors"
                                >
                                    <Eye size={16} /> Preview
                                </button>
                                <button
                                    onClick={() => onDownload(file)}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                    title="Download"
                                >
                                    <Download size={20} />
                                </button>
                                {onDelete && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(file);
                                        }}
                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div
                            key={file.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, file)}
                            className="group bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 hover:border-brand-500/50 hover:shadow-2xl transition-all duration-300 flex items-center justify-between cursor-grab active:cursor-grabbing active:opacity-60 active:scale-[0.98] active:shadow-lg active:ring-2 active:ring-brand-500"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                {/* Drag handle */}
                                <div className="opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0">
                                    <GripVertical size={16} className="text-slate-500" />
                                </div>
                                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-slate-700 transition-colors shadow-inner border border-slate-700/50">
                                    <FileText className="text-brand-400" size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-base font-bold text-white truncate" title={file.name}>{file.name}</h4>
                                    <p className="text-xs text-slate-400 font-medium">{file.size} • {formatDate(file.uploadedAt, 'short')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <button onClick={() => onPreview(file)} className="p-2.5 hover:bg-slate-700 rounded-xl text-brand-300 transition-all shadow-sm hover:shadow" title="Preview">
                                    <Eye size={20} />
                                </button>
                                <button onClick={() => onDownload(file)} className="p-2.5 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-all shadow-sm hover:shadow" title="Download">
                                    <Download size={20} />
                                </button>
                                {onDelete && (
                                    <button onClick={() => onDelete(file)} className="p-2.5 hover:bg-red-900/20 text-slate-400 hover:text-red-400 rounded-xl transition-all shadow-sm hover:shadow" title="Delete">
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                }
            })}
        </div>
    );
}
