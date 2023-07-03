export const darkenColor = (color) => {
  if (color === null) {
    return null;
  }
  // Extract the RGB values from the color string
  const match = color?.match(/\d+/g);
  if (!match || match?.length !== 3) {
    console.log('Invalid color format');
  }

  // Darken the color by reducing the RGB values
  const darkenedColor = match?.map((value) => Math.max(value - 40, 0));

  // Return the darkened color as a formatted string
  return `rgb(${darkenedColor.join(', ')})`;
};
