import React from 'react';
import { Pet } from '../types';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface PetCardProps {
  pet: Pet;
  onClick?: () => void;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, onClick }) => {
  const getStatusBadge = () => {
    switch (pet.status) {
      case 'lost':
        return <div className="absolute top-3 right-3 px-3 py-1 bg-alert-clay text-white shadow text-sm font-bold rounded-full">Lost</div>;
      case 'sighted':
        return <div className="absolute top-3 right-3 px-3 py-1 bg-trail text-white shadow text-sm font-bold rounded-full">Sighted</div>;
      case 'safe':
      default:
        return <div className="absolute top-3 right-3 px-3 py-1 bg-safe-neutral text-brand-dark shadow text-sm font-bold rounded-full">Safe</div>;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-2xl p-4 shadow-sm border ${pet.status === 'lost' ? 'border-alert-clay ring-2 ring-alert-clay/20' : 'border-[#E8E0D5]'} cursor-pointer flex flex-col gap-4 focus-within:ring-2 focus-within:ring-brand-orange`}
      onClick={onClick}
    >
      <div className="relative h-48 w-full rounded-xl overflow-hidden bg-safe-neutral">
        <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
        {getStatusBadge()}
      </div>
      <div>
        <h3 className="text-xl font-bold text-brand-dark">{pet.name}</h3>
        <p className="text-[#8B847B]">{pet.breed}</p>
      </div>
      <Link 
        to={`/pets/${pet.id}`} 
        className="w-full py-2 bg-safe-neutral text-brand-dark font-semibold rounded-xl hover:bg-brand-orange hover:text-white transition-colors text-center focus:outline-none focus:ring-2 focus:ring-brand-orange block"
      >
        View Profile
      </Link>
    </motion.div>
  );
};
