import { Calculator, Zap } from 'lucide-react';

interface SubjectCardProps {
  title: string;
  subtitle: string;
  description: string;
  subject: 'math' | 'physics';
  onClick: () => void;
}

const SubjectCard = ({ title, subtitle, description, subject, onClick }: SubjectCardProps) => {
  const Icon = subject === 'math' ? Calculator : Zap;

  return (
    <div 
      className={`subject-card ${subject}`}
      onClick={onClick}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
            <Icon size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">{title}</h2>
            <p className="text-white/80 text-lg">{subtitle}</p>
          </div>
        </div>
        
        <p className="text-white/90 text-lg leading-relaxed mb-6">
          {description}
        </p>
        
        <div className="flex items-center text-white/80 font-medium">
          <span>Start Learning</span>
          <svg 
            className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10 animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/10 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default SubjectCard;