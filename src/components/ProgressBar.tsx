interface ProgressBarProps {
  current: number;
  total: number;
  unitName: string;
}

const ProgressBar = ({ current, total, unitName }: ProgressBarProps) => {
  const progress = (current / total) * 100;

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-card-foreground capitalize">
            {unitName.replace('-', ' ')} Unit
          </h2>
          <p className="text-card-foreground/70 text-sm">
            Slide {current} of {total}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            {Math.round(progress)}%
          </div>
          <div className="text-card-foreground/70 text-sm">
            Complete
          </div>
        </div>
      </div>

      <div className="progress-bar h-3">
        <div 
          className="progress-fill h-full rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-card-foreground/60">
        <span>Start</span>
        <span>Finish</span>
      </div>
    </div>
  );
};

export default ProgressBar;