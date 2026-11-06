import React from 'react';
import { X } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const measurements = [
    { size: 'XS', bust: '32', waist: '26', hip: '34', length: '44' },
    { size: 'S', bust: '34', waist: '28', hip: '36', length: '44' },
    { size: 'M', bust: '36', waist: '30', hip: '38', length: '45' },
    { size: 'L', bust: '38', waist: '32', hip: '40', length: '45' },
    { size: 'XL', bust: '40', waist: '34', hip: '42', length: '46' },
    { size: 'XXL', bust: '42', waist: '36', hip: '44', length: '46' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 z-10 border border-[#E8DFD0]">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD0]">
          <h3 className="font-serif text-lg font-semibold text-[#191714]">
            Size Guide (Inches)
          </h3>
          <button onClick={onClose} className="text-[#746D62] hover:text-[#191714]">
            <X size={20} />
          </button>
        </div>

        <p className="text-xs text-[#746D62] mt-3 mb-4">
          All measurements are garment measurements in inches. For standard fit, choose a size that allows 2-3 inches of comfort ease over your body measurements.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF6F0] text-[#003D2D] font-semibold border-b border-[#E8DFD0]">
              <tr>
                <th className="p-2.5">Size</th>
                <th className="p-2.5">Bust</th>
                <th className="p-2.5">Waist</th>
                <th className="p-2.5">Hip</th>
                <th className="p-2.5">Kurti Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD0]/60">
              {measurements.map((m) => (
                <tr key={m.size} className="hover:bg-[#FFF8ED]">
                  <td className="p-2.5 font-bold text-[#191714]">{m.size}</td>
                  <td className="p-2.5 text-[#746D62]">{m.bust}&quot;</td>
                  <td className="p-2.5 text-[#746D62]">{m.waist}&quot;</td>
                  <td className="p-2.5 text-[#746D62]">{m.hip}&quot;</td>
                  <td className="p-2.5 text-[#746D62]">{m.length}&quot;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#003D2D] text-white text-xs font-semibold rounded-full uppercase tracking-wider"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
