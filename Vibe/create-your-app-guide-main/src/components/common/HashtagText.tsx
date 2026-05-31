import { Link } from 'react-router-dom';
import { Fragment } from 'react';

interface HashtagTextProps {
  text: string;
  className?: string;
}

export default function HashtagText({ text, className = '' }: HashtagTextProps) {
  // Regex to match hashtags
  const hashtagRegex = /(#[a-zA-Z0-9_]+)/g;
  
  // Split text by hashtags while keeping the hashtags
  const parts = text.split(hashtagRegex);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.match(hashtagRegex)) {
          const hashtag = part.slice(1); // Remove the # symbol for the search query
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
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </span>
  );
}
