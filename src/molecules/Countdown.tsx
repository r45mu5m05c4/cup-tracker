import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Typography from "./Typography";

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
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 60%

   @media (max-width: 768px) {
      width: 90%
  }
`;

const TimeBlock = styled.div`
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TimeNumber = styled.div`
  font-size: 3.2em;
  font-weight: bold;
  display: flex;
  color: #575757;
  margin-top: 20px;

  @media (max-width: 768px) {
    font-size: 2em;
  }
`;

const TimeDigit = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2px 14px;
  margin: 6px;
  box-shadow: 4px 3px 4px 2px rgb(2 33 34 / 78%), inset 2px 4px 0 0 rgb(53 53 53 / 7%);
  font-family: 'Space Mono', sans-serif;

   @media (max-width: 768px) {
      padding: 0 8px;
  }
`;

const TimeLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  padding-top: 4px;
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

  const renderTimeNumberSections = (time: number) => {
    const digits = String(time).split("");

    if (digits.length < 2) {
      digits.unshift("0");
    }

    return digits.map((digit, index) => (
      <TimeDigit key={index}>{digit}</TimeDigit>
    ));
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
        <TimeNumber>{renderTimeNumberSections(timeLeft.days)}</TimeNumber>
        <TimeLabel>
          <Typography variant="p">days</Typography>
        </TimeLabel>
      </TimeBlock>
      <TimeBlock>
        <TimeNumber>{renderTimeNumberSections(timeLeft.hours)}</TimeNumber>
        <TimeLabel>
          <Typography variant="p">hours</Typography>
        </TimeLabel>
      </TimeBlock>
      <TimeBlock>
        <TimeNumber>{renderTimeNumberSections(timeLeft.minutes)}</TimeNumber>
        <TimeLabel>
          <Typography variant="p">minutes</Typography>
        </TimeLabel>
      </TimeBlock>
    </CountdownContainer>
  );
};

export default Countdown;
