import analyze from 'rgbaster';

// export const rgbToHex = (rgbColor) => {
//   // deconstruct the string into the seperate R,G,B values
//   const [red, green, blue] = rgbColor.match(/\d+/g);
//   // Convert RGB to Hex ("+" changes values (letters) to numbers)
//   return (
//     'from-[#' +
//     ((1 << 24) | (+red << 16) | (+green << 8) | +blue).toString(16).slice(1) +
//     ']'
//   );
// };

export const rgbToHex = (rgbColor) => {
  // deconstruct the string into the seperate R,G,B values
  const [red, green, blue] = rgbColor.match(/\d+/g);
  // Convert RGB to Hex ("+" changes values (letters) to numbers)
  return (
    '#' +
    ((1 << 24) | (+red << 16) | (+green << 8) | +blue).toString(16).slice(1)
  );
};

export function extractDominantColor(colorArray) {
  // Define thresholds for saturation and brightness
  const saturationThreshold = 20;
  const brightnessThreshold = 64;

  // Find the first color that is not black, gray, or low in saturation
  const dominantColor = colorArray.find((colorObj) => {
    const color = colorObj.color;
    const rgbValues = color.match(/\d+/g);
    const [r, g, b] = rgbValues.map(Number);

    // Calculate saturation using the formula
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = (max - min) / 255;
    const saturation = delta * 100;

    // Calculate brightness using the formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return (
      saturation >= saturationThreshold && brightness >= brightnessThreshold
    );
  });

  if (dominantColor) {
    const rgbColor = dominantColor.color;
    const colorString = rgbColor.replace(/\s/g, ''); // Remove any whitespace characters
    // return null
    return colorString;
  }
  return null;
}

export const analyseImageColor = async (imageUrl) => {
  const colorArray = await analyze(imageUrl, {
    scale: 0.6,
    ignore: ['rgb(0,0,0)'],
  });
  const dominantColor = extractDominantColor(colorArray);
  return dominantColor
  console.log("dom ", dominantColor);
  // return dominantColor ? rgbToHex(dominantColor) : null;
};
