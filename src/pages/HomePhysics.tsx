import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import UnitCard from '../components/UnitCard';

const physicsUnits = [
  { id: 'kinematics', name: 'Kinematics', description: 'Motion in one and two dimensions' },
  { id: 'forces', name: 'Forces', description: 'Newton\'s laws and force analysis' },
  { id: 'energy', name: 'Energy', description: 'Work, energy, and power concepts' },
  { id: 'waves', name: 'Waves', description: 'Wave properties and behavior' },
  { id: 'electricity', name: 'Electricity and Magnetism', description: 'Electric circuits and magnetic fields' }
];

const HomePhysics = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="nav-button flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-physics-primary to-physics-secondary bg-clip-text text-transparent">
              Physics
            </span>
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            SPH3U - Choose a unit to explore the fundamental laws of nature
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {physicsUnits.map((unit) => (
            <UnitCard
              key={unit.id}
              title={unit.name}
              description={unit.description}
              subject="physics"
              onClick={() => navigate(`/lesson/${unit.id}`, { state: { subject: 'physics' } })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePhysics;