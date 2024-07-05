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
`;

const TimeBlock = styled.div`
  margin: 0 10px;
`;

const TimeNumber = styled.div`
  font-size: 3.2em;
  font-weight: bold;
  display: flex;
  color: #575757;
`;

const TimeDigit = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 4px 16px;
  margin: 6px;
  `;

const TimeLabel = styled.span`
  font-size: 1.1em;
  font-weight: 600;
  color: #C8C8C8;
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
    const digits = String(time).split('');

    if (digits.length < 2) {
      digits.unshift("0")
    }

    return digits
      .map((digit, index) => (
        <TimeDigit key={index} >{digit}</TimeDigit>
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
