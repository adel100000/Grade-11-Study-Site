import { Trophy, Star, ArrowLeft } from 'lucide-react';

interface CompletionScreenProps {
  unitId: string;
  onReturnHome: () => void;
}

const CompletionScreen = ({ unitId, onReturnHome }: CompletionScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-card rounded-3xl p-12 shadow-[var(--shadow-card)] border border-border relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-8 left-8 w-16 h-16 bg-primary rounded-full animate-pulse"></div>
            <div className="absolute top-16 right-12 w-12 h-12 bg-physics-primary rounded-full animate-pulse delay-500"></div>
            <div className="absolute bottom-12 left-16 w-20 h-20 bg-math-primary rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-8 right-8 w-8 h-8 bg-success rounded-full animate-pulse delay-1500"></div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-gradient-to-br from-primary/20 to-success/20 rounded-full animate-glow">
                <Trophy size={64} className="text-primary" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-card-foreground mb-4">
              Unit Completed! 
            </h1>
            
            <div className="flex items-center justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={24} 
                  className="text-yellow-400 fill-current animate-pulse" 
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>

            <p className="text-xl text-card-foreground/80 mb-8 max-w-md mx-auto leading-relaxed">
              Congratulations! You've successfully completed the{' '}
              <span className="font-semibold text-primary capitalize">
                {unitId.replace('-', ' ')}
              </span>{' '}
              unit. You're ready for the next challenge!
            </p>

            <div className="space-y-4">
              <div className="bg-accent/30 rounded-2xl p-6 border border-accent">
                <h3 className="font-bold text-card-foreground mb-2">
                  What you've mastered:
                </h3>
                <p className="text-card-foreground/70">
                  ✓ Key concepts and principles<br/>
                  ✓ Problem-solving techniques<br/>
                  ✓ Interactive quizzes and assessments
                </p>
              </div>

              <button
                onClick={onReturnHome}
                className="nav-button primary text-lg px-8 py-4 flex items-center gap-3 mx-auto"
              >
                <ArrowLeft size={20} />
                Choose Another Unit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;