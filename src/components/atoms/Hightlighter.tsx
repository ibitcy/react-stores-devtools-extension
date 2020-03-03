/* @jsx jsx */
import * as React from "react";
import { css, jsx } from "@emotion/core";
import { areSimilar } from "react-stores";

interface IProps {
  watch: any;
  deepEqual?: boolean;
  disable?: boolean;
}

const ANIMATION_TIME = 500;
const VALUE = 0.8;

export const Hightlighter: React.FC<IProps> = props => {
  const prevRef = React.useRef<any>(props.watch);
  const hightlightRef = React.useRef<HTMLDivElement>(null);

  const startRef = React.useRef<number>(null);
  const currentProgressRef = React.useRef<number>(ANIMATION_TIME);
  const prevProgressRef = React.useRef<number>(0);
  const animationRef = React.useRef<number>(null);

  const step = React.useCallback(function(timestamp: number) {
    if (!startRef.current) {
      startRef.current = timestamp;
    }
    currentProgressRef.current = timestamp - startRef.current;
    const y = Math.abs(
      Math.sin(
        (currentProgressRef.current + prevProgressRef.current) /
          (ANIMATION_TIME / Math.PI)
      )
    );
    if (hightlightRef.current) {
      hightlightRef.current.style.opacity = String(VALUE * y);
    }

    if (currentProgressRef.current < ANIMATION_TIME - prevProgressRef.current) {
      animationRef.current = window.requestAnimationFrame(step);
      return;
    }

    window.cancelAnimationFrame(animationRef.current);
    currentProgressRef.current = ANIMATION_TIME;
    prevProgressRef.current = 0;
    startRef.current = null;
    if (hightlightRef.current) {
      hightlightRef.current.style.opacity = String(0);
    }
  }, []);

  const fire = React.useCallback(function() {
    if (
      prevProgressRef.current + currentProgressRef.current <
      ANIMATION_TIME / 2
    ) {
      return;
    }
    window.cancelAnimationFrame(animationRef.current);
    prevProgressRef.current =
      ANIMATION_TIME - currentProgressRef.current - prevProgressRef.current;
    startRef.current = null;
    animationRef.current = window.requestAnimationFrame(step);
  }, []);

  React.useEffect(() => {
    if (
      !props.disable &&
      ((props.deepEqual && !areSimilar(props.watch, prevRef.current)) ||
        props.watch !== prevRef.current)
    ) {
      fire();
    }
    prevRef.current = props.watch;
  }, [props.watch, props.disable]);

  return (
    <span css={root}>
      <div ref={hightlightRef} css={hightlight} />
      <span css={value}>{props.children}</span>
    </span>
  );
};

const root = css`
  position: relative;
`;

const value = css`
  position: relative;
  z-index: 2;
`;

const hightlight = css`
  position: absolute;
  z-index: 1;
  right: 0;
  top: 0;
  left: 0;
  bottom: 0;
  background: var(--bg-hightlight-color);
  border: 1px solid var(--border-hightlight-color);
  opacity: 0;
`;
