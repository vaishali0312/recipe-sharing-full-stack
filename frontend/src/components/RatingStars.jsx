import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function RatingStars({rating, setRating}){
  const { dark } = useContext(ThemeContext);
  
  return(
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n=>(
        <span
          key={n}
          onClick={() => setRating(n)}
          className={`cursor-pointer text-2xl transition-all hover:scale-110 ${
            n <= rating 
              ? 'text-yellow-500' 
              : dark 
                ? 'text-gray-600' 
                : 'text-gray-300'
          }`}
          style={{
            color: n <= rating ? '#eab308' : (dark ? '#525252' : '#d1d5db'),
            textShadow: n <= rating ? '0 0 4px rgba(234, 179, 8, 0.6)' : 'none',
            // Show empty star (☆) when not selected, filled star (★) when selected
            fontVariationSettings: n <= rating ? '"FILL" 1' : '"FILL" 0'
          }}
          aria-label={`Rate ${n} stars`}
        >
          {n <= rating ? '★' : '☆'}
        </span>
      ))}
    </div>

    

    
  );
}