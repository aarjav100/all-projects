import { Link } from 'react-router-dom';
import { Fragment } from 'react';

interface MentionHashtagTextProps {
  text: string;
  className?: string;
}

export default function MentionHashtagText({ text, className = '' }: MentionHashtagTextProps) {
  // Regex to match hashtags and mentions
  const combinedRegex = /(#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)/g;
  
  // Split text by hashtags and mentions while keeping them
  const parts = text.split(combinedRegex);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        // Check if it's a hashtag
        if (part.startsWith('#')) {
          return (
            <Link
              key={index}
              to={`/search?q=${encodeURIComponent(part)}`}
              className="text-primary hover:underline font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </Link>
          );
        }
        // Check if it's a mention
        if (part.startsWith('@')) {
          const username = part.slice(1); // Remove the @ symbol
          return (
            <Link
              key={index}
              to={`/user/${username}`}
              className="text-accent-foreground bg-accent/20 hover:bg-accent/30 px-1 rounded font-medium transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </Link>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </span>
  );
}
