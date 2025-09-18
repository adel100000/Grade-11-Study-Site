import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Brain } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface Question {
  question: string;
  options: string[];
  answer: number;
}

interface QuizProps {
  questions: Question[];
  onComplete: (answers: number[]) => void;
  answers: number[];
}

// Helper to render KaTeX for quiz text
const renderQuizContent = (content: string) => {
  const blockRegex = /\$\$(.*?)\$\$/gs;
  const inlineRegex = /\$(.*?)\$/g;

  const parts = content.split(blockRegex);

  return parts.map((part, idx) => {
    if (idx % 2 === 1) {
      return <BlockMath key={idx}>{part}</BlockMath>;
    } else {
      const inlineParts = part.split(inlineRegex);
      return inlineParts.map((subPart, subIdx) => {
        if (subIdx % 2 === 1) {
          return <InlineMath key={`${idx}-${subIdx}`}>{subPart}</InlineMath>;
        } else {
          return <span key={`${idx}-${subIdx}`}>{subPart}</span>;
        }
      });
    }
  });
};

const Quiz = ({ questions, onComplete, answers: initialAnswers }: QuizProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    initialAnswers.length > 0 ? [...initialAnswers] : new Array(questions.length).fill(null)
  );
  const [showFeedback, setShowFeedback] = useState(initialAnswers.length > 0);

  useEffect(() => {
    if (showFeedback && selectedAnswers.every(a => a !== null)) {
      onComplete(selectedAnswers as number[]);
    }
  }, [selectedAnswers, showFeedback, onComplete]);

  const handleAnswerSelect = (qIdx: number, aIdx: number) => {
    if (showFeedback) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[qIdx] = aIdx;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (selectedAnswers.every(a => a !== null)) setShowFeedback(true);
  };

  const allAnswered = selectedAnswers.every(a => a !== null);
  const score = showFeedback
    ? selectedAnswers.reduce((acc, a, idx) => acc + (a === questions[idx].answer ? 1 : 0), 0)
    : 0;

  return (
    <div className="bg-card rounded-3xl p-8 shadow-[var(--shadow-card)] border border-border">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/20 rounded-2xl">
          <Brain size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-card-foreground">Quiz Time!</h2>
          <p className="text-card-foreground/70">Test your understanding with these questions</p>
        </div>
      </div>

      {showFeedback && (
        <div className={`mb-6 p-4 rounded-2xl border-2 ${
          score === questions.length ? 'bg-success/20 border-success/50 text-success-foreground'
          : score >= questions.length / 2 ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
          : 'bg-error/20 border-error/50 text-error-foreground'
        }`}>
          <div className="flex items-center gap-3">
            {score === questions.length ? <CheckCircle size={24}/> : <XCircle size={24}/>}
            <div>
              <p className="font-bold">Score: {score}/{questions.length} {score === questions.length && '- Perfect!'}</p>
              <p className="text-sm opacity-80">{score === questions.length ? 'Excellent work! You can proceed to the next lesson.' : 'Review the feedback below and try again if needed.'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const selected = selectedAnswers[qIdx];
          return (
            <div key={qIdx} className="bg-accent/30 rounded-2xl p-6 border border-accent">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                {renderQuizContent(`${qIdx + 1}. ${q.question}`)}
              </h3>
              <div className="grid gap-3">
                {q.options.map((opt, aIdx) => {
                  const isSelected = selected === aIdx;
                  const isCorrect = aIdx === q.answer;
                  const showCorrect = showFeedback && isCorrect;
                  const showIncorrect = showFeedback && isSelected && !isCorrect;

                  return (
                    <button
                      key={aIdx}
                      onClick={() => handleAnswerSelect(qIdx, aIdx)}
                      disabled={showFeedback}
                      className={`p-4 rounded-xl text-left transition-all duration-200 border-2 ${
                        showCorrect ? 'quiz-correct border-success/50'
                        : showIncorrect ? 'quiz-incorrect border-error/50'
                        : isSelected ? 'bg-primary/20 border-primary/50 text-primary-foreground'
                        : 'bg-card border-border hover:bg-card-hover hover:border-primary/30'
                      } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          showCorrect ? 'border-success bg-success text-success-foreground'
                          : showIncorrect ? 'border-error bg-error text-error-foreground'
                          : isSelected ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border'
                        }`}>
                          {showCorrect && <CheckCircle size={16}/>}
                          {showIncorrect && <XCircle size={16}/>}
                          {isSelected && !showFeedback && <div className="w-2 h-2 bg-current rounded-full"/>}
                        </div>
                        <span>{renderQuizContent(opt)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!showFeedback && (
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`nav-button primary text-lg px-8 py-4 ${!allAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Submit Quiz
          </button>
          {!allAnswered && (
            <p className="text-card-foreground/60 text-sm mt-2">Please answer all questions before submitting</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
