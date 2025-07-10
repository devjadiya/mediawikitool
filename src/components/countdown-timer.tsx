'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CountdownTimerProps {
  targetDate: Date;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const calculateTimeLeft = () => {
    const difference = +targetDate - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Set initial time left
    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isClient) {
    return (
        <Card className="bg-secondary">
          <CardContent className="p-6">
            <div className="text-center text-lg font-semibold">Loading countdown...</div>
          </CardContent>
        </Card>
      );
  }

  const timerComponents = Object.entries(timeLeft).map(([interval, value]) => (
    <div key={interval} className="flex flex-col items-center">
      <span className="text-3xl sm:text-4xl font-bold tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs uppercase tracking-widest text-muted-foreground">
        {interval}
      </span>
    </div>
  ));

  const isCompetitionOver = +targetDate - +new Date() < 0;

  return (
    <Card className="bg-secondary">
      <CardContent className="p-6">
        {isCompetitionOver ? (
            <div className="text-center text-lg font-semibold">The competition period has ended. Thank you for your participation!</div>
        ) : (
            <>
                <h3 className="text-center text-lg font-semibold mb-4">Competition Starts In:</h3>
                <div className="grid grid-cols-4 gap-4">
                    {timerComponents}
                </div>
            </>
        )}
      </CardContent>
    </Card>
  );
}
