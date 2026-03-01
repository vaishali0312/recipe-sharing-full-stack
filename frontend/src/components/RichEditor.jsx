import { useState, useRef } from "react";

export default function RichEditor({ value, onChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);

  const handleFocus = () => {
    setIsEditing(true);
    // Focus and set cursor to end
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const len = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(len, len);
      }
    }, 0);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  // Simple textarea that supports basic formatting hints
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
      {/* Simple toolbar with tips */}
      <div className="border-b border-gray-200 dark:border-gray-600 p-2 flex gap-2 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          💡 Tips: Use • for bullet points, numbers for steps
        </span>
      </div>
      
      {/* Textarea for instructions */}
      <textarea
        ref={textareaRef}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Enter instructions here...&#10;• Step 1&#10;• Step 2&#10;Or use numbered steps:&#10;1. First step&#10;2. Second step"
        className={`w-full min-h-[200px] p-4 rounded-b-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-y focus:outline-none focus:ring-2 focus:ring-orange-500 ${isEditing ? 'ring-2 ring-orange-500' : ''}`}
      />
    </div>
  );
}
