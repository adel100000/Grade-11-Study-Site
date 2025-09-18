import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

interface NavButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isLastSlide: boolean;
  onReturnHome: () => void;
}

const NavButtons = ({ 
  onPrevious, 
  onNext, 
  canGoBack, 
  canGoForward, 
  isLastSlide,
  onReturnHome 
}: NavButtonsProps) => {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onReturnHome}
        className="nav-button flex items-center gap-2"
      >
        <Home size={20} />
        <span className="hidden sm:inline">Return Home</span>
      </button>

      <div className="flex items-center gap-4">
        <button
          onClick={onPrevious}
          disabled={!canGoBack}
          className="nav-button flex items-center gap-2"
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <button
          onClick={onNext}
          disabled={!canGoForward}
          className={`nav-button flex items-center gap-2 ${
            canGoForward ? 'primary' : ''
          }`}
        >
          <span className="hidden sm:inline">
            {isLastSlide ? 'Complete Unit' : 'Next'}
          </span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default NavButtons;