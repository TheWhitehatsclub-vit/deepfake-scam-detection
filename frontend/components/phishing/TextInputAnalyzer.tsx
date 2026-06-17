'use client';
import { useState } from 'react';

interface TextInputAnalyzerProps {
  onTextChange: (text: string) => void;
}

export default function TextInputAnalyzer({ onTextChange }: TextInputAnalyzerProps) {
  const [text, setText] = useState('');
  const maxLength = 5000;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange(newText);
  };

  return (
    <div className="text-input-container">
      <div className="divider">
        <span>or</span>
      </div>
      <div className="text-input-card">
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Paste the email or message text here..."
          maxLength={maxLength}
          className="text-input"
        />
        <div className="char-counter">
          {text.length} / {maxLength}
        </div>
      </div>
    </div>
  );
}
