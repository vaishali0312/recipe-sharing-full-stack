// Parse ingredient string to extract quantity, unit, and name
// Examples: "400g spaghetti" -> { quantity: 400, unit: "g", name: "spaghetti" }
// "2 cups mixed vegetables" -> { quantity: 2, unit: "cups", name: "mixed vegetables" }
export const parseIngredient = (ingredient) => {
  if (!ingredient || typeof ingredient !== 'string') {
    return { quantity: null, unit: '', name: ingredient };
  }
  
  // Match pattern: number at the start (can be decimal or fraction)
  const match = ingredient.match(/^([\d./]+)\s*([a-zA-Z]*)\s*(.*)$/);
  
  if (match) {
    let quantity = parseFloat(match[1]);
    // Handle fractions like "1/2"
    if (isNaN(quantity) && match[1].includes('/')) {
      const [num, denom] = match[1].split('/');
      quantity = parseFloat(num) / parseFloat(denom);
    }
    
    return {
      quantity: isNaN(quantity) ? null : quantity,
      unit: match[2] || '',
      name: match[3] || ''
    };
  }
  
  return { quantity: null, unit: '', name: ingredient };
};

// Format scaled ingredient back to string
export const formatIngredient = (parsed) => {
  if (parsed.quantity === null) {
    return parsed.name || '';
  }
  
  // Round to 2 decimal places if needed
  const qty = Math.round(parsed.quantity * 100) / 100;
  
  if (parsed.unit && parsed.name) {
    return `${qty}${parsed.unit} ${parsed.name}`;
  } else if (parsed.unit) {
    return `${qty}${parsed.unit}`;
  } else if (parsed.name) {
    return `${qty} ${parsed.name}`;
  }
  return String(qty);
};

// Scale ingredients based on serving size change
export const scaleIngredients = (ingredients, originalServings, newServings) => {
  if (!ingredients || !Array.isArray(ingredients)) {
    return ingredients;
  }
  
  if (!originalServings || originalServings <= 0) {
    return ingredients;
  }
  
  const ratio = newServings / originalServings;
  
  return ingredients.map(ingredient => {
    const parsed = parseIngredient(ingredient);
    
    if (parsed.quantity === null) {
      // No quantity to scale, return original
      return ingredient;
    }
    
    return formatIngredient({
      ...parsed,
      quantity: parsed.quantity * ratio
    });
  });
};
