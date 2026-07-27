import React, { useState } from 'react';
import { Upload, Camera, FileText, X, Check, Image as ImageIcon } from 'lucide-react';

interface UploadAnexoDocumentosProps {
  fotoUrl?: string;
  onFotoChange?: (base64OrUrl: string) => void;
  documentosUrls?: string[];
  onDocumentosChange?: (urls: string[]) => void;
}

export const UploadAnexoDocumentos: React.FC<UploadAnexoDocumentosProps> = ({
  fotoUrl,
  onFotoChange,
  documentosUrls = [],
  onDocumentosChange,
}) => {
  const [currentFoto, setCurrentFoto] = useState<string>(fotoUrl || '');
  const [currentDocs, setCurrentDocs] = useState<string[]>(documentosUrls || []);

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCurrentFoto(result);
        if (onFotoChange) onFotoChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDocsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCurrentDocs((prev) => {
            const updated = [...prev, result];
            if (onDocumentosChange) onDocumentosChange(updated);
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDoc = (index: number) => {
    const updated = currentDocs.filter((_, idx) => idx !== index);
    setCurrentDocs(updated);
    if (onDocumentosChange) onDocumentosChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* 1. Foto de Perfil do Cliente */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-[#00D084]" />
          <span>Foto de Perfil do Cliente</span>
        </label>

        <div className="flex items-center gap-3">
          {currentFoto ? (
            <div className="relative group shrink-0">
              <img
                src={currentFoto}
                alt="Foto Cliente"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#00D084]"
              />
              <button
                type="button"
                onClick={() => {
                  setCurrentFoto('');
                  if (onFotoChange) onFotoChange('');
                }}
                className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-500 text-white shadow-md hover:scale-110 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className="w-16 h-16 rounded-2xl bg-[#0B0F17] border border-dashed border-[#1E293B] hover:border-[#00D084] flex flex-col items-center justify-center cursor-pointer transition text-gray-400 hover:text-[#00D084] shrink-0">
              <Camera className="w-5 h-5" />
              <span className="text-[9px] font-bold mt-1">Anexar</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoUpload}
                className="hidden"
              />
            </label>
          )}

          <div className="text-xs text-gray-400 space-y-0.5">
            <p className="font-semibold text-white">Foto Rosto / Selfie</p>
            <p className="text-[10px]">JPG, PNG ou WEBP até 5MB</p>
          </div>
        </div>
      </div>

      {/* 2. Anexo de Documentos (RG/CPF) */}
      <div className="space-y-1.5 pt-2 border-t border-[#1E293B]">
        <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#00D084]" />
          <span>Documentos Anexados (RG / CPF / Comprovante)</span>
        </label>

        <div className="grid grid-cols-4 gap-2">
          {currentDocs.map((doc, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden border border-[#1E293B] bg-[#0B0F17] aspect-square">
              <img src={doc} alt={`Doc ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeDoc(idx)}
                className="absolute top-1 right-1 p-1 rounded-full bg-rose-500 text-white shadow-md hover:scale-110 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          <label className="aspect-square rounded-xl bg-[#0B0F17] border border-dashed border-[#1E293B] hover:border-[#00D084] flex flex-col items-center justify-center cursor-pointer transition text-gray-400 hover:text-[#00D084]">
            <Upload className="w-4 h-4" />
            <span className="text-[9px] font-bold mt-1">+ Add</span>
            <input
              type="file"
              accept="image/*,application/pdf"
              multiple
              onChange={handleDocsUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
