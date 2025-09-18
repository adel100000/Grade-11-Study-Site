import { BookOpen, Play } from 'lucide-react';

interface UnitCardProps {
  title: string;
  description: string;
  subject: 'math' | 'physics';
  onClick: () => void;
}

const UnitCard = ({ title, description, subject, onClick }: UnitCardProps) => {
  return (
    <div className="unit-card group" onClick={onClick}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${
          subject === 'math' 
            ? 'from-math-primary/20 to-math-secondary/20' 
            : 'from-physics-primary/20 to-physics-secondary/20'
        }`}>
          <BookOpen size={24} className={`${
            subject === 'math' ? 'text-math-primary' : 'text-physics-primary'
          }`} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-card-foreground/70 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-card-foreground/60 text-sm">
          <Play size={16} />
          <span>Start Unit</span>
        </div>
        
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${
          subject === 'math' 
            ? 'from-math-primary to-math-secondary' 
            : 'from-physics-primary to-physics-secondary'
        } flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <svg 
            className="w-4 h-4 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default UnitCard;