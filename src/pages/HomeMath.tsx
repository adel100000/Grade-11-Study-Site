import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import UnitCard from '../components/UnitCard';

const mathUnits = [
  { id: 'functions', name: 'Functions', description: 'Introduction to functions and their properties' },
  { id: 'rational', name: 'Rational Expressions', description: 'Working with rational expressions and equations' },
  { id: 'transformations', name: 'Transformations', description: 'Transforming functions and their graphs' },
  { id: 'exponential', name: 'Exponential Functions', description: 'Exponential and logarithmic functions' },
  { id: 'trig', name: 'Trigonometry', description: 'Basic trigonometric ratios and identities' },
  { id: 'trig-functions', name: 'Trigonometric Functions', description: 'Sine, cosine, and tangent functions' },
  { id: 'discrete', name: 'Discrete Functions', description: 'Sequences, series, and discrete mathematics' }
];

const HomeMath = () => {
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
            <span className="bg-gradient-to-r from-math-primary to-math-secondary bg-clip-text text-transparent">
              Mathematics
            </span>
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            MCR3U - Choose a unit to begin your mathematical journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mathUnits.map((unit) => (
            <UnitCard
              key={unit.id}
              title={unit.name}
              description={unit.description}
              subject="math"
              onClick={() => navigate(`/lesson/${unit.id}`, { state: { subject: 'math' } })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeMath;