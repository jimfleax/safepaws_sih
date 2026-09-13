import React from 'react';
import { Pet } from '../types';
import { motion } from 'motion/react';

interface PetCardProps {
  pet: Pet;
  onClick?: () => void;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E0D5] cursor-pointer flex flex-col gap-4"
      onClick={onClick}
    >
      <div className="relative h-48 w-full rounded-xl overflow-hidden bg-[#E8E0D5]">
        <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur text-sm font-bold rounded-full text-[#DE6828]">
          {pet.status === 'safe' ? 'Safe' : pet.status === 'lost' ? 'Lost' : 'Sighted'}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-[#241812]">{pet.name}</h3>
        <p className="text-[#8B847B]">{pet.breed}</p>
      </div>
      <button className="w-full py-2 bg-[#FAF6F0] text-[#DE6828] font-semibold rounded-xl hover:bg-[#DE6828] hover:text-white transition-colors">
        View Profile
      </button>
    </motion.div>
  );
};
