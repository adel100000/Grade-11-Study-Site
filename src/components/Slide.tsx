import { useState } from 'react'; 
import Quiz from './Quiz';
import { BookOpen, Image, Play, Link, X } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface SlideData {
  type: 'lesson' | 'quiz';
  title?: string;
  content?: string;
  media?: {
    image?: string;
    video?: string;
  };
  supplementary?: string;
  questions?: Array<{
    question: string;
    options: string[];
    answer: number;
  }>;
}

interface SlideProps {
  slideData: SlideData;
  onQuizComplete: (answers: number[]) => void;
  quizAnswers: number[];
  videoUrl?: string | null;
}

// Helper to render KaTeX content
const renderContentWithKatex = (content: string) => {
  if (!content) return null;

  const blockRegex = /\$\$(.*?)\$\$/gs;
  const inlineRegex = /\$(.*?)\$/g;

  const parts = content.split(blockRegex);

  return parts.map((part, idx) => {
    if (idx % 2 === 1) {
      return <BlockMath key={idx}>{part.trim()}</BlockMath>;
    } else {
      const inlineParts = part.split(inlineRegex);
      return inlineParts.map((subPart, subIdx) =>
        subIdx % 2 === 1 ? (
          <InlineMath key={`${idx}-${subIdx}`}>{subPart.trim()}</InlineMath>
        ) : (
          <span key={`${idx}-${subIdx}`}>{subPart}</span>
        )
      );
    }
  });
};

const Slide = ({ slideData, onQuizComplete, quizAnswers, videoUrl }: SlideProps) => {
  const [mediaError, setMediaError] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  // Render quiz first if slide is a quiz
  if (slideData.type === 'quiz' && slideData.questions?.length) {
    return (
      <div className="slide-enter-active">
        <Quiz questions={slideData.questions} onComplete={onQuizComplete} answers={quizAnswers} />
      </div>
    );
  }

  const imageUrl = slideData.media?.image || null;
  const isGif = imageUrl?.toLowerCase().endsWith('.gif');

  return (
    <div className="slide-enter-active">
      <div className="bg-card rounded-3xl p-8 shadow-[var(--shadow-card)] border border-border">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-primary/20 rounded-2xl">
            <BookOpen size={24} className="text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-card-foreground">
            {slideData.title || 'Lesson'}
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left column: content & video */}
          <div className="space-y-6">
            {/* Lesson content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-card-foreground/80 leading-relaxed text-lg">
                {slideData.content
                  ? renderContentWithKatex(slideData.content)
                  : 'Lesson content will appear here.'}
              </div>
            </div>

            {/* Video */}
            {videoUrl && (
              <div className="bg-accent/50 rounded-2xl p-6 border-2 border-dashed border-accent">
                <div className="text-center mb-3">
                  <Play size={24} className="mx-auto mb-2" />
                  <p className="font-medium">Interactive Content</p>
                </div>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={videoUrl}
                    title={slideData.title || 'Video Lesson'}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right column: image & supplementary */}
          <div className="space-y-4">
            {/* Image / GIF */}
            {imageUrl && !mediaError ? (
              <>
                <div
                  className="bg-accent rounded-2xl overflow-hidden aspect-video cursor-pointer hover:opacity-90 transition"
                  onClick={() => setIsImageOpen(true)}
                >
                  <img
                    src={imageUrl}
                    alt="Lesson illustration"
                    className={`w-full h-full ${isGif ? 'object-contain' : 'object-cover'}`}
                    onError={() => setMediaError(true)}
                  />
                </div>

                {/* Modal for full image */}
                {isImageOpen && (
                  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <button
                      onClick={() => setIsImageOpen(false)}
                      className="absolute top-4 right-4 text-white bg-black/60 rounded-full p-2 hover:bg-black transition"
                    >
                      <X size={24} />
                    </button>
                    <img
                      src={imageUrl}
                      alt="Full size illustration"
                      className="max-w-full max-h-full rounded-xl shadow-lg"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-accent rounded-2xl aspect-video flex items-center justify-center border-2 border-dashed border-accent-foreground/20">
                <div className="text-center text-accent-foreground/60">
                  <Image size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="font-medium">Visual Content</p>
                  <p className="text-sm mt-1">Images and diagrams will be displayed here</p>
                </div>
              </div>
            )}

            {/* Supplementary */}
            {slideData.supplementary && (
              <div className="bg-accent/30 rounded-2xl p-4 border border-accent">
                <div className="flex flex-col items-center text-accent-foreground/70">
                  <Link size={20} className="mb-2" />
                  <a
                    href={slideData.supplementary}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline text-sm"
                  >
                    Supplementary Material
                  </a>
                  <p className="text-xs mt-1 text-center">
                    Additional materials and references
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide;
