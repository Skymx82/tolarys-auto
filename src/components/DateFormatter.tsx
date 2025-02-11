'use client';

import { useEffect, useState } from 'react';

interface DateFormatterProps {
  date: string;
  format?: 'short' | 'long';
}

export default function DateFormatter({ date, format = 'short' }: DateFormatterProps) {
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    const d = new Date(date);
    if (format === 'short') {
      setFormattedDate(d.toLocaleDateString());
    } else {
      setFormattedDate(d.toLocaleString());
    }
  }, [date, format]);

  return <span>{formattedDate}</span>;
}
