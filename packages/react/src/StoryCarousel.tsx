import React, { useEffect, useRef, useState } from "react";
import {
  StoryCarousel as StoryCarouselCore,
  Story,
  StoryCarouselConfig,
  StoryCarouselState,
} from "@storykit/core";

export interface StoryCarouselProps extends Omit<
  StoryCarouselConfig,
  "onStoryEnd" | "onStoryStart" | "onComplete"
> {
  className?: string;
  style?: React.CSSProperties;
  renderStory?: (story: Story, progress: number) => React.ReactNode;
  onStoryEnd?: (story: Story) => void;
  onStoryStart?: (story: Story) => void;
  onComplete?: () => void;
}

export const StoryCarousel: React.FC<StoryCarouselProps> = ({
  stories,
  autoPlay = true,
  defaultDuration = 5000,
  className,
  style,
  renderStory,
  onStoryEnd,
  onStoryStart,
  onComplete,
}) => {
  const carouselRef = useRef<StoryCarouselCore | null>(null);
  const [state, setState] = useState<StoryCarouselState | null>(null);

  useEffect(() => {
    if (!stories.length) return;

    const config: StoryCarouselConfig = {
      stories,
      autoPlay,
      defaultDuration,
      onStoryEnd: (story) => {
        onStoryEnd?.(story);
      },
      onStoryStart: (story) => {
        onStoryStart?.(story);
      },
      onComplete: () => {
        onComplete?.();
      },
    };

    carouselRef.current = new StoryCarouselCore(config);
    setState(carouselRef.current.getState());

    if (autoPlay) {
      carouselRef.current.play();
    }

    // Update state periodically
    const interval = setInterval(() => {
      if (carouselRef.current) {
        setState(carouselRef.current.getState());
      }
    }, 100);

    return () => {
      clearInterval(interval);
      carouselRef.current?.destroy();
    };
  }, [
    stories,
    autoPlay,
    defaultDuration,
    onStoryEnd,
    onStoryStart,
    onComplete,
  ]);

  const handleNext = () => {
    carouselRef.current?.next();
  };

  const handlePrev = () => {
    carouselRef.current?.prev();
  };

  const handlePause = () => {
    carouselRef.current?.pause();
  };

  const handlePlay = () => {
    carouselRef.current?.play();
  };

  if (!state || !state.currentStory) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      {/* Progress indicators */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          right: 10,
          zIndex: 10,
          display: "flex",
          gap: 4,
        }}
      >
        {stories.map((_, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              height: 2,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                backgroundColor:
                  index === state.currentIndex
                    ? "#fff"
                    : "rgba(255, 255, 255, 0.5)",
                width:
                  index === state.currentIndex
                    ? `${state.progress * 100}%`
                    : index < state.currentIndex
                      ? "100%"
                      : "0%",
                transition:
                  index === state.currentIndex ? "none" : "width 0.3s ease",
              }}
            />
          </div>
        ))}
      </div>

      {/* Story content */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {renderStory ? (
          renderStory(state.currentStory, state.progress)
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "24px",
            }}
          >
            {state.currentStory.content}
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={handlePrev}
        disabled={state.currentIndex === 0}
        style={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0, 0, 0, 0.5)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 40,
          height: 40,
          cursor: state.currentIndex === 0 ? "not-allowed" : "pointer",
          opacity: state.currentIndex === 0 ? 0.5 : 1,
          zIndex: 10,
        }}
      >
        ‹
      </button>

      <button
        onClick={handleNext}
        disabled={state.currentIndex === stories.length - 1}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0, 0, 0, 0.5)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 40,
          height: 40,
          cursor:
            state.currentIndex === stories.length - 1
              ? "not-allowed"
              : "pointer",
          opacity: state.currentIndex === stories.length - 1 ? 0.5 : 1,
          zIndex: 10,
        }}
      >
        ›
      </button>

      {/* Play/Pause button */}
      <button
        onClick={state.isPlaying ? handlePause : handlePlay}
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0, 0, 0, 0.5)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 50,
          height: 50,
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        {state.isPlaying ? "⏸" : "▶"}
      </button>
    </div>
  );
};
