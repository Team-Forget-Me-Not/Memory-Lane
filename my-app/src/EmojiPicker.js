import React, { useState } from 'react';

const EmojiPicker = ({ onSelect }) => {
  const [emojis] = useState([
    ['😊', '😄', '😎', '😍', '🤩'],
    ['😂', '😅', '😆', '😜', '😉'],
  ]);

  return (
    <div className="emoji-picker">
      {emojis.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((emoji, colIndex) => (
            <span key={colIndex} onClick={() => onSelect(emoji)}>
              {emoji}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default EmojiPicker;
