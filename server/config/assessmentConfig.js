// Central Assessment Configuration

export const MAX_QUESTIONS_PER_TEST = 25;

export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard', 'very-hard'];

export const MIXED_DIFFICULTY_DISTRIBUTION = {
  easy: 5,
  medium: 8,
  hard: 7,
  'very-hard': 5,
};

export const NORMALIZE_DIFFICULTY = (diffStr) => {
  if (!diffStr) return 'medium';
  const lower = String(diffStr).toLowerCase();
  if (lower === 'easy' || lower === 'beginner') return 'easy';
  if (lower === 'medium' || lower === 'intermediate') return 'medium';
  if (lower === 'hard' || lower === 'advanced') return 'hard';
  if (lower === 'very-hard' || lower === 'veryhard' || lower === 'expert') return 'very-hard';
  return 'medium';
};
