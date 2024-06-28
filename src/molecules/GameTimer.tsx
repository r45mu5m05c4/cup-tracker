import { useEffect, useState, useRef, FC } from "react";
import { differenceInMilliseconds } from "date-fns";
import { format, isBefore, isToday, isTomorrow, isYesterday } from "date-fns";
import styled, { keyframes } from "styled-components";

const GameTimer: FC<{ startTime: Date; ended: boolean }> = ({
  startTime,
  ended,
}) => {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateElapsedMinutes = () => {
      const currentTime = new Date();
      const elapsedMilliseconds = currentTime.getTime() - startTime.getTime();
      const minutes = Math.floor(elapsedMilliseconds / (60 * 1000));
      setElapsedMinutes(minutes);
    };

    const startTimer = () => {
      const currentTime = new Date();
      const timeUntilStart = differenceInMilliseconds(startTime, currentTime);

      if (timeUntilStart > 0) {
        setTimeout(() => {
          updateElapsedMinutes();
          timerRef.current = setInterval(updateElapsedMinutes, 1000);
        }, timeUntilStart);
      } else {
        updateElapsedMinutes();
        timerRef.current = setInterval(updateElapsedMinutes, 1000);
      }
    };

    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTime]);

  const getDateString = (date: Date) => {
    if (isYesterday(date))
      return `Yesterday ${format(new Date(date), "HH:mm")} `;
    if (isToday(date)) return `Today ${format(new Date(date), "HH:mm")} `;
    if (isTomorrow(date)) return `Tomorrow ${format(new Date(date), "HH:mm")} `;
    else return format(new Date(date), "HH:mm - dd MMMM");
  };
  const $isActive = isBefore(startTime, new Date()) && !ended;

  const getGameMinute = () => {
    if (elapsedMinutes < 15) return elapsedMinutes;
    if (elapsedMinutes > 15 && elapsedMinutes < 17) return "Break";
    if (elapsedMinutes > 17 && elapsedMinutes < 45) return elapsedMinutes - 2;
    else return "OT";
  };

  return elapsedMinutes < 45 && $isActive ? (
    <GameTimeContainer>
      <LiveCircle />
      {`'${getGameMinute()}`}
    </GameTimeContainer>
  ) : (
    <> {getDateString(startTime)}</>
  );
};

export default GameTimer;

const GameTimeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const blinkingAnimation = keyframes` 
50%   {
  transform: scale(2);
  opacity: 0
}
100%   {
  transform: scale(2);
  opacity: 0

}`;

const LiveCircle = styled.div`
  margin: 15px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #343a40;
  position: relative;

  &:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #00ff00;
    animation: ${blinkingAnimation} 2s infinite;
  }
`;
