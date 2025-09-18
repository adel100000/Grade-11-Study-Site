import { useNavigate } from 'react-router-dom';
import SubjectCard from '../components/SubjectCard';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
            Grade 11 Study Hub
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto">
            Master MCR3U Math and SPH3U Physics with interactive lessons and quizzes
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <SubjectCard
            title="Mathematics"
            subtitle="MCR3U - Functions"
            description="Explore functions, transformations, trigonometry, and more"
            subject="math"
            onClick={() => navigate('/math')}
          />
          <SubjectCard
            title="Physics"
            subtitle="SPH3U - Physics"
            description="Discover kinematics, forces, energy, waves, and electricity"
            subject="physics"
            onClick={() => navigate('/physics')}
          />
        </div>
      </div>
    </div>
  );
};

export default Landing;