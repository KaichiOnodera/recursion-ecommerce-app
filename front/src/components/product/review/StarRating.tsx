import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const SIZE_CLASSES = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
} as const;

const STARS = [1, 2, 3, 4, 5] as const;
const ANIMATION_DURATION = 300; // ミリ秒

export const StarRating: React.FC<StarRatingProps> = React.memo(
  ({
    rating,
    size = 'md',
    showNumber = false,
    interactive = false,
    onRatingChange,
  }) => {
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const [clickedStar, setClickedStar] = useState<number | null>(null);

    const displayRating = hoveredRating ?? rating;
    const sizeClass = SIZE_CLASSES[size];
    const isHovering = hoveredRating !== null;

    // クリックアニメーションのリセット
    useEffect(() => {
      if (clickedStar !== null) {
        const timer = window.setTimeout(() => {
          setClickedStar(null);
        }, ANIMATION_DURATION);
        return () => window.clearTimeout(timer);
      }
    }, [clickedStar]);

    const handleClick = useCallback(
      (star: number) => {
        if (interactive && onRatingChange) {
          setClickedStar(star);
          onRatingChange(star);
        }
      },
      [interactive, onRatingChange],
    );

    const handleMouseEnter = useCallback(
      (star: number) => {
        if (interactive) {
          setHoveredRating(star);
        }
      },
      [interactive],
    );

    const handleMouseLeave = useCallback(() => {
      if (interactive) {
        setHoveredRating(null);
      }
    }, [interactive]);

    const roundedRating = useMemo(() => Math.round(rating), [rating]);

    // 星の色を決定（ホバー中はより濃い色、通常時は通常の黄色）
    const getStarColor = useCallback(
      (star: number) => {
        const isFilled = star <= Math.round(displayRating);
        if (!isFilled) return 'text-gray-300';

        if (isHovering && interactive) {
          return 'text-yellow-500'; // ホバー中はより濃い黄色
        }
        return 'text-yellow-400'; // 通常時
      },
      [displayRating, isHovering, interactive],
    );

    return (
      <div className="flex items-center" onMouseLeave={handleMouseLeave}>
        {STARS.map((star) => {
          const isClicked = clickedStar === star;
          return (
            <span
              key={star}
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              className={`inline-flex items-center justify-center p-1 ${interactive ? 'cursor-pointer' : ''}`}
            >
              {star <= Math.round(displayRating) ? (
                <StarIcon
                  className={`${sizeClass} ${getStarColor(star)} transition-all duration-300 ${
                    isClicked ? 'animate-pulse scale-125' : ''
                  }`}
                />
              ) : (
                <StarOutlineIcon
                  className={`${sizeClass} ${getStarColor(star)} transition-all duration-300 ${
                    isClicked ? 'animate-pulse scale-125' : ''
                  }`}
                />
              )}
            </span>
          );
        })}
        {showNumber && (
          <span className="ml-2 text-sm text-gray-600">{roundedRating}</span>
        )}
      </div>
    );
  },
);

StarRating.displayName = 'StarRating';
