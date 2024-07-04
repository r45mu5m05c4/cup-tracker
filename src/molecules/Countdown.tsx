import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface CountdownProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  isTimeUp: boolean;
}

const CountdownContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
  font-size: 2em;
  color: #333;
  margin: auto;
  margin-left: 0;
`;

const TimeBlock = styled.div`
  margin: 0 10px;
  text-align: center;
`;

const TimeNumber = styled.div`
  font-size: 1.5em;
  font-weight: bold;
`;

const TimeLabel = styled.div`
  font-size: 0.75em;
  text-transform: uppercase;
`;

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: TimeLeft;

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        isTimeUp: false,
      };
    } else {
      timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        isTimeUp: true,
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isTimeUp) {
    return null; // Don't render anything if the time is up
  }

  return (
    <CountdownContainer>
      <TimeBlock>
        <TimeNumber>{timeLeft.days}</TimeNumber>
        <TimeLabel>Days</TimeLabel>
      </TimeBlock>
      <TimeBlock>
        <TimeNumber>{timeLeft.hours}</TimeNumber>
        <TimeLabel>Hours</TimeLabel>
      </TimeBlock>
      <TimeBlock>
        <TimeNumber>{timeLeft.minutes}</TimeNumber>
        <TimeLabel>Minutes</TimeLabel>
      </TimeBlock>
    </CountdownContainer>
  );
};

export default Countdown;
