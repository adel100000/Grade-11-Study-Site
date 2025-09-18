// src/pages/LessonViewer.tsx  (or /src/views/LessonViewer.tsx depending on your structure)
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Slide from '../components/Slide';
import NavButtons from '../components/NavButtons';
import ProgressBar from '../components/ProgressBar';
import CompletionScreen from '../components/CompletionScreen';
import { getYouTubeEmbedUrl } from '../lib/utils';

interface SlideData {
  type?: 'lesson' | 'quiz';
  title?: string;
  content?: string;
  media?: {
    image?: string;
    video?: string;
  };
  // For quiz slides we expect questions[]
  questions?: Array<{
    question: string;
    options: string[];
    // note: keep the shape the same as your JSON (index or value)
    answer: any;
  }>;
  // Legacy single-question shape
  question?: string;
  options?: string[];
  answer?: any;
  supplementary?: string;
  // accept other arbitrary fields
  [k: string]: any;
}

const LessonViewer = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const subject = (location.state as any)?.subject;

  useEffect(() => {
    if (!subject) return;
    loadUnitData();
    // reset slide index when switching units
    setCurrentSlide(0);
  }, [unitId, subject]);

  const loadUnitData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/data/${subject}/${unitId}.json`);
      if (!response.ok) throw new Error('File not found');

      const data = await response.json();

      // rawSlides handles either an array file or an object with slides[]
      const rawSlides: any[] = Array.isArray(data) ? data : data.slides || [];

      // First step: normalize media keys and keep everything else
      const fixedSlides: SlideData[] = rawSlides.map((s: any) => {
        const slide: SlideData = { ...s };

        // normalize media: if slide.media exists, keep; otherwise map legacy image/video root keys
        if (!slide.media) {
          if (s.image || s.video) {
            slide.media = {
              image: s.image ? String(s.image).replace(/^\/public/, '') : undefined,
              video: s.video ? s.video : undefined,
            };
          }
        } else {
          // if media.image exists and begins with /public, strip it
          if (slide.media.image && typeof slide.media.image === 'string') {
            slide.media.image = slide.media.image.replace(/^\/public/, '');
          }
        }

        // keep supplementary if present (nothing to change)
        return slide;
      });

      // Second step: coalesce consecutive single-question quiz slides into one quiz slide
      const normalized: SlideData[] = [];
      let quizGroup: SlideData | null = null;

      const pushQuizGroupIfAny = () => {
        if (quizGroup) {
          normalized.push(quizGroup);
          quizGroup = null;
        }
      };

      for (let i = 0; i < fixedSlides.length; i++) {
        const s = fixedSlides[i];
        const type = s.type ?? (s.question || s.questions ? 'quiz' : 'lesson'); // tolerant default

        if (type === 'quiz') {
          // Case 1: slide already has a questions[] array -> push as-is (close any running group first)
          if (Array.isArray(s.questions) && s.questions.length > 0) {
            pushQuizGroupIfAny();
            normalized.push(s);
            continue;
          }

          // Case 2: legacy single-question shape (s.question present)
          if (typeof s.question === 'string') {
            if (!quizGroup) {
              quizGroup = { type: 'quiz', questions: [] };
            }
            // push the single question into the group
            (quizGroup.questions as any[]).push({
              question: s.question,
              options: Array.isArray(s.options) ? s.options : [],
              answer: s.answer,
            });

            // Lookahead: if next slide is not a single-question quiz, flush the group
            const next = fixedSlides[i + 1];
            const nextIsSingleQuiz = next && (next.type === 'quiz' || !next.type) && typeof next.question === 'string';
            if (!nextIsSingleQuiz) {
              pushQuizGroupIfAny();
            }
            continue;
          }

          // Case 3: quiz-type but no questions and no question -> malformed quiz slide.
          // To avoid a blank/unskippable slide, convert to a safe lesson fallback.
          pushQuizGroupIfAny();
          normalized.push({
            type: 'lesson',
            title: s.title ?? 'Lesson (untitled)',
            content: s.content ?? 'Content not available for this slide.',
            media: s.media,
            supplementary: s.supplementary,
          });
        } else {
          // Regular lesson slide: flush any quizGroup first, then push lesson
          pushQuizGroupIfAny();
          normalized.push(s);
        }
      }

      // flush leftover group (if file ended with quiz slides)
      pushQuizGroupIfAny();

      setSlides(normalized);
    } catch (error) {
      console.error('Error loading unit data:', error);
      setSlides(getFallbackData(unitId || ''));
    } finally {
      setLoading(false);
    }
  };

  const getFallbackData = (unitId: string): SlideData[] => [
    {
      type: 'lesson',
      title: `Introduction to ${unitId}`,
      content: `Fallback content for ${unitId}. Place your JSON files in /public/data/${subject}/${unitId}.json`,
    },
    {
      type: 'quiz',
      questions: [
        {
          question: `What is ${unitId}?`,
          options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
          answer: 0,
        },
      ],
    },
  ];

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((s) => s + 1);
      setQuizAnswers([]);
      setQuizCompleted(false);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((s) => s - 1);
      setQuizAnswers([]);
      setQuizCompleted(false);
    }
  };

  const handleQuizComplete = (answers: number[]) => {
    setQuizAnswers(answers);
    setQuizCompleted(true);
  };

  const handleReturnHome = () => {
    navigate(subject === 'math' ? '/math' : '/physics');
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading lesson...</p>
        </div>
      </div>
    );

  // Defensive: if slides array is empty, show fallback completion screen
  if (!slides || slides.length === 0) {
    return <CompletionScreen unitId={unitId || ''} onReturnHome={handleReturnHome} />;
  }

  // clamp currentSlide just in case
  const clampedIndex = Math.max(0, Math.min(currentSlide, slides.length - 1));
  if (clampedIndex !== currentSlide) setCurrentSlide(clampedIndex);

  const slide = slides[clampedIndex];

  // treat unknown types as lessons (prevents getting stuck)
  const slideType = slide.type ?? 'lesson';

  // can proceed if it's a lesson (always) OR it's a quiz and quizCompleted is true
  const canProceed = slideType === 'lesson' || (slideType === 'quiz' && quizCompleted);

  // convert media.video to embeddable youtube url if provided
  const videoUrl: string | null = slide.media?.video ? getYouTubeEmbedUrl(String(slide.media.video)) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <ProgressBar current={clampedIndex + 1} total={slides.length} unitName={unitId || ''} />
          <div className="mt-8">
            <Slide
              slideData={slide}
              onQuizComplete={handleQuizComplete}
              quizAnswers={quizAnswers}
              videoUrl={videoUrl}
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <NavButtons
            onPrevious={goToPrevSlide}
            onNext={goToNextSlide}
            canGoBack={clampedIndex > 0}
            canGoForward={canProceed}
            isLastSlide={clampedIndex === slides.length - 1}
            onReturnHome={handleReturnHome}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
