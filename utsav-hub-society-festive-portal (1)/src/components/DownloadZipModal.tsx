import React, { useState } from 'react';
import { Download, CheckCircle2, Terminal, FolderArchive, X, Sparkles, FileCode2, Copy, Check } from 'lucide-react';
import { downloadProjectZip } from '../utils/downloadZip';
import { playTempleBell, playSitarPluck } from '../utils/audio';
import { triggerPhoolBarsao } from '../utils/confetti';

interface DownloadZipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadZipModal: React.FC<DownloadZipModalProps> = ({ isOpen, onClose }) => {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'zipping' | 'completed' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleStartDownload = async () => {
    try {
      setDownloadStatus('zipping');
      playSitarPluck('Sa');
      
      await downloadProjectZip((msg) => {
        setStatusMessage(msg);
      });

      setDownloadStatus('completed');
      setStatusMessage('Download started! Check your browser downloads.');
      playTempleBell(960);
      triggerPhoolBarsao();
    } catch (err) {
      console.error('Download error:', err);
      setDownloadStatus('error');
      setStatusMessage('Could not package zip. Please try again.');
    }
  };

  const copyRunCommand = () => {
    navigator.clipboard.writeText('npm install && npm run dev');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  return (
    <div
      id="download-zip-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-emerald-950 border-2 border-amber-400/50 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden p-6 sm:p-8 my-auto">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="close-zip-modal-btn"
          onClick={() => {
            playSitarPluck('Sa');
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-emerald-900/80 hover:bg-emerald-800 text-amber-200 border border-emerald-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
            <FolderArchive className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400">
              Instant Source Code Export
            </span>
            <h3 className="text-2xl sm:text-3xl font-display text-amber-100">
              Download Project ZIP
            </h3>
          </div>
        </div>

        <p className="text-sm text-emerald-200/90 leading-relaxed mb-6">
          This bundles <strong>100% of the project code</strong> (React 19, TypeScript, 3D temple pillars, flower toran garland, AI face matcher, audio synthesizer, and CSS styling) into a ready-to-run ZIP archive.
        </p>

        {/* Primary Download Action Card */}
        <div className="p-5 rounded-2xl bg-emerald-900/50 border border-amber-400/30 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
            <div>
              <div className="text-base font-bold text-amber-200 flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-amber-400" />
                <span>utsav-hub-society-festive-portal.zip</span>
              </div>
              <span className="text-xs text-emerald-300/80">
                Complete self-contained bundle • All components included
              </span>
            </div>

            <button
              id="trigger-download-zip-btn"
              disabled={downloadStatus === 'zipping'}
              onClick={handleStartDownload}
              className={`py-3.5 px-6 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-95 ${
                downloadStatus === 'zipping'
                  ? 'bg-amber-600/50 text-amber-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-emerald-950 border border-amber-300 shadow-[0_4px_20px_rgba(245,158,11,0.4)]'
              }`}
            >
              {downloadStatus === 'zipping' ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-emerald-950" />
                  <span>Packaging Files...</span>
                </>
              ) : downloadStatus === 'completed' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                  <span>Download Again</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-emerald-950" />
                  <span>Click to Download ZIP</span>
                </>
              )}
            </button>
          </div>

          {statusMessage && (
            <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-400/30 rounded-lg p-2.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* 3 Step Run Instructions */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Terminal className="w-4 h-4" /> How to run it on your laptop:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800">
              <span className="font-bold text-amber-300 block mb-1">1. Extract ZIP</span>
              <p className="text-emerald-300/80 text-[11px]">Right-click the zip file and choose "Extract All".</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800">
              <span className="font-bold text-amber-300 block mb-1">2. Install</span>
              <p className="text-emerald-300/80 text-[11px]">Open Terminal in folder & run <code>npm install</code></p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800">
              <span className="font-bold text-amber-300 block mb-1">3. Start</span>
              <p className="text-emerald-300/80 text-[11px]">Run <code>npm run dev</code> to open in your browser.</p>
            </div>
          </div>
        </div>

        {/* Copy Command helper */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-emerald-800 font-mono text-xs text-amber-200">
          <span>npm install && npm run dev</span>
          <button
            onClick={copyRunCommand}
            className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-300 transition-colors flex items-center gap-1 text-[11px] font-sans font-semibold"
          >
            {copiedCmd ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
