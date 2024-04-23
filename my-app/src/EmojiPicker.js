import React, { useState } from 'react';

const EmojiPicker = ({ onSelect }) => {
  const [emojis] = useState([
    {
      category: 'Smileys & Emotion',
      emojis: ['😊', '😄', '😎', '😍', '🤩', '😇', '😂', '😅', '😆', '😜', '😉', '😋', '😘', '😁', '😏', '🤪', '🥰', '😌', '😛', '😝', '🤗'],
    },
    {
      category: 'Animals & Nature',
      emojis: ['😻', '🙀', '😸', '😺', '😼', '😽', '💔', '🖤', '💝', '💘', '💞', '💖', '💕', '💓', '💗', '💟', '💜', '💚', '💛', '💙', '🤍'],
    },
    {
      category: 'Food & Drink',
      emojis: ['🍇', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅', '🍆', '🥑', '🥦', '🥒', '🌽', '🥕'],
    },
    {
      category: 'Activities',
      emojis: ['⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥏', '🏑', '🏒', '🥍', '🏏', '🪀', '🥅', '⛳️', '🏹'],
    },
    {
      category: 'Travel & Places',
      emojis: ['✈️', '🚀', '🚁', '🛸', '🚂', '🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🛴'],
    },
    {
      category: 'Objects',
      emojis: ['⌚️', '📱', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽'],
    },
    // Add more categories and emojis as needed
  ]);

  return (
    <div className="emoji-picker">
      {emojis.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <h2>{category.category}</h2>
          {category.emojis.map((emoji, emojiIndex) => (
            <span
              key={emojiIndex}
              onClick={() => onSelect(emoji)}
              style={{ fontSize: '2em', cursor: 'pointer' }} // Adjust the font size as needed
            >
              {emoji}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default EmojiPicker;
