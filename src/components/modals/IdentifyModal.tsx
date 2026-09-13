import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Fingerprint, Upload, AlertCircle, CheckCircle, Search, Info } from 'lucide-react';
import { ApiClient } from '../../utils/apiClient';
import { SearchResponse } from '../../types';

interface IdentifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIdentifySuccess?: (result: SearchResponse) => void;
  pipelineMode: string;
}

export const IdentifyModal: React.FC<IdentifyModalProps> = ({
  isOpen,
  onClose,
  onIdentifySuccess,
  pipelineMode
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error' | 'ambiguous' | 'unknown'>('idle');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setStatus('idle');
      setMessage('');
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setStatus('scanning');
    try {
      const result = await ApiClient.identifyPet(file);
      if (result.status === 'MATCH') {
        setStatus('success');
        setMessage(result.message || 'Match found!');
      } else if (result.status === 'AMBIGUOUS') {
        setStatus('ambiguous');
        setMessage(result.message || 'Multiple possible matches found.');
      } else {
        setStatus('unknown');
        setMessage(result.message || 'No match found.');
      }
      if (onIdentifySuccess) onIdentifySuccess(result);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'An error occurred during identification.');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative w-full max-w-md bg-[#FAF6F0] rounded-[28px] border border-[#E9DCcb] shadow-2xl p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FDE8DC] flex items-center justify-center text-[#DE6828]">
              <Search className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-[#241812]">Identify Pet</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#E5D7C7] transition-colors">
            <X className="w-5 h-5 text-[#6E5A4D]" />
          </button>
        </div>

        <div className="space-y-4">
          {!preview ? (
            <div 
              className="border-2 border-dashed border-[#DE6828]/30 rounded-2xl p-8 text-center cursor-pointer hover:bg-[#FDFBF7] transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 mx-auto text-[#DE6828] mb-2" />
              <p className="text-sm font-semibold text-[#241812]">Upload Pet Photo</p>
              <p className="text-xs text-[#6F5D52] mt-1">JPEG, PNG up to 5MB</p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-[#E9DCcb]">
              <img src={preview} alt="Upload preview" className="w-full h-48 object-cover" />
              <button 
                onClick={() => { setFile(null); setPreview(null); setStatus('idle'); }}
                className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/jpeg, image/png, image/webp"
            onChange={handleFileChange}
          />

          {status === 'error' && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl flex gap-2 items-start text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{message}</p>
            </div>
          )}
          
          {status === 'unknown' && (
            <div className="p-3 bg-yellow-50 text-yellow-800 rounded-xl flex gap-2 items-start text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{message}</p>
            </div>
          )}

          {status === 'ambiguous' && (
            <div className="p-3 bg-blue-50 text-blue-800 rounded-xl flex gap-2 items-start text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="p-3 bg-green-50 text-green-800 rounded-xl flex flex-col gap-2 text-sm">
              <div className="flex gap-2 items-start">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <p>{message}</p>
              </div>
              {pipelineMode === 'DEMONSTRATOR' && (
                <div className="mt-1 flex gap-2 items-start bg-[#FAF6F0] p-2 rounded border border-[#E9DCcb] text-[#241812]">
                  <Info className="w-4 h-4 shrink-0 text-[#DE6828]" />
                  <p className="text-xs">Prototype Mode: This match is a deterministic scaffold demonstration, not a scientifically validated biometric result.</p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleScan}
            disabled={!file || status === 'scanning'}
            className="w-full py-3 rounded-full bg-[#DE6828] hover:bg-[#C9581B] text-white font-semibold disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
          >
            {status === 'scanning' ? (
              <span className="animate-pulse">Analyzing...</span>
            ) : (
              <>
                <Fingerprint className="w-5 h-5" />
                <span>Identify</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
