import { useRef, useState } from 'react';
import { Plus, Trash2, FileText, ChevronUp, ChevronDown, X, BarChart3, ArrowRight, Download } from 'lucide-react';
import { UploadedFile } from './types';

interface FileSelectionStepProps {
  files: UploadedFile[];
  selectedFiles: string[];
  setSelectedFiles: (ids: string[]) => void;
  onFilesChange: (files: UploadedFile[]) => void;
  onBack: () => void;
  onNext: () => void;
  onUpload: (files: File[]) => void;
  onDownload: (file: UploadedFile) => void;
}

export default function FileSelectionStep({
  files,
  selectedFiles,
  setSelectedFiles,
  onFilesChange,
  onBack,
  onNext,
  onUpload,
  onDownload
}: FileSelectionStepProps) {
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const toggleFileSelection = (id: string) => {
    setSelectedFiles(
      selectedFiles.includes(id)
        ? selectedFiles.filter((fileId) => fileId !== id)
        : [...selectedFiles, id]
    );
  };

  const selectAllFiles = () => {
    setSelectedFiles(selectedFiles.length === files.length ? [] : files.map((file) => file.id));
  };

  const removeFile = (id: string) => {
    const newFiles = files.filter(f => f.id !== id);
    onFilesChange(newFiles);
    if (selectedFiles.includes(id)) {
      setSelectedFiles(selectedFiles.filter(fid => fid !== id));
    }
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
  };

  const handleAddMore = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
        .filter(file =>
          file.type === 'application/pdf' ||
          file.type.startsWith('image/')
        );
      onUpload(newFiles);
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-1 py-1">
      <div className="bg-white/5 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-900/30">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Select Files
                </h2>
                <p className="text-sm text-white/50">
                  Choose which documents to analyze
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="px-5 py-2 text-sm font-medium text-white/70
                                    hover:text-white
                                    border border-white/15 rounded-lg
                                    hover:bg-white/10 transition"
              >
                Back
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2 text-sm font-medium
                                    bg-white/10
                                    text-white/80
                                    border border-white/15 rounded-lg
                                    hover:bg-white/20
                                    flex items-center gap-2 transition"
              >
                <Plus size={16} />
                Add More
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/*"
                onChange={handleAddMore}
                className="hidden"
                multiple
              />
            </div>
          </div>
        </div>

        {/* Selection Bar */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedFiles.length === files.length && files.length > 0}
                  onChange={selectAllFiles}
                  className="rounded border-white/20
                                        accent-brand-500
                                        w-4 h-4 transition"
                />
                <span className="text-sm font-medium text-white/80">
                  Select All
                </span>
              </label>
              <span className="text-sm text-white/50">
                {selectedFiles.length} of {files.length} selected
              </span>
            </div>
            {selectedFiles.length > 0 && (
              <button
                onClick={clearAllFiles}
                className="text-sm text-red-400 hover:text-red-300
                                    flex items-center gap-1.5 transition"
              >
                <Trash2 size={14} />
                Clear Selection
              </button>
            )}
          </div>
        </div>

        {/* Files List */}
        <div className="p-6">
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-brand-900/30
                                flex items-center justify-center mb-4">
                <FileText size={24} className="text-brand-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                No files uploaded
              </h3>
              <p className="text-sm text-white/50 mb-4">
                Add files to get started with analysis
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 text-sm font-medium
                                    bg-gradient-to-r from-brand-600 to-brand-700
                                    hover:from-brand-700 hover:to-brand-800
                                    text-white rounded-lg
                                    flex items-center gap-2 transition"
              >
                <Plus size={16} />
                Upload Files
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`border rounded-lg transition-all cursor-pointer
                                        ${selectedFiles.includes(file.id)
                      ? 'border-brand-500/60 bg-brand-900/20'
                      : 'border-white/10 hover:border-brand-400/40 hover:bg-white/5'
                    }`}
                >
                  {/* File Row */}
                  <div
                    className="flex items-center gap-3 p-3"
                    onClick={() => toggleFileSelection(file.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => { }}
                      className="rounded border-white/20
                                                accent-brand-500
                                                w-4 h-4 transition"
                    />

                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                                            ${selectedFiles.includes(file.id)
                        ? 'bg-brand-900/40'
                        : 'bg-white/10'
                      }`}>
                      <FileText size={18} className={
                        selectedFiles.includes(file.id)
                          ? 'text-brand-400'
                          : 'text-white/50'
                      } />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {file.name || file.file?.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-white/40">
                          {file.fileSize}
                        </span>
                        <span className="text-xs text-white/30">•</span>
                        <span className="text-xs text-white/40">
                          {formatDate(file.uploadDate)}
                        </span>
                        {file.status === 'uploading' && (
                          <span className="text-xs text-brand-400 animate-pulse">
                            Uploading...
                          </span>
                        )}
                        {file.status === 'error' && (
                          <span className="text-xs text-red-400">
                            Error
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {(file.status === 'completed' || file.serverFileId) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownload(file);
                          }}
                          className="p-1.5 rounded-lg text-white/30
                                                        hover:text-brand-400
                                                        hover:bg-white/10 transition"
                        >
                          <Download size={14} />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedFile(expandedFile === file.id ? null : file.id);
                        }}
                        className="p-1.5 rounded-lg text-white/30
                                                    hover:text-white/70
                                                    hover:bg-white/10 transition"
                      >
                        {expandedFile === file.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="p-1.5 rounded-lg text-white/30
                                                    hover:text-red-400
                                                    hover:bg-white/10 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedFile === file.id && (
                    <div className="px-3 pb-3 pt-1 border-t border-white/10">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-white/40 mb-1">File Name</p>
                          <p className="text-white font-medium">
                            {file.name || file.file?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/40 mb-1">Size</p>
                          <p className="text-white font-medium">
                            {file.fileSize}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {files.length > 0 && (
          <div className="px-6 py-4 border-t border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-semibold text-brand-400">
                  {selectedFiles.length}
                </span>
                <span className="text-white/50 ml-1">
                  files selected for analysis
                </span>
              </div>
              <button
                onClick={onNext}
                disabled={selectedFiles.length === 0}
                className="px-6 py-2.5 text-sm font-medium
                                    bg-gradient-to-r from-brand-600 to-brand-700
                                    hover:from-brand-500 hover:to-brand-600
                                    disabled:from-white/10 disabled:to-white/10
                                    disabled:text-white/30 disabled:cursor-not-allowed
                                    text-white rounded-lg
                                    flex items-center gap-2
                                    shadow-lg shadow-brand-900/30 hover:shadow-brand-900/50
                                    transition-all duration-200"
              >
                <BarChart3 size={16} />
                Analyze Selected
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}