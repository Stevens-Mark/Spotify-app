import analyze from 'rgbaster';

/**
 * Takes array of rgb color objects & returns the most dominante color within 
 * a certain range (avoid return too darker colors) otherwise null
 * @function extractDominantColor
 * @param {array} colorArray 
 * @returns {string} rgb(n0, n1, n3) or null
//  */
export function extractDominantColor(colorArray) {
  // Calculate the thresholds for saturation and brightness once
  const saturationThreshold = 20;
  const brightnessThreshold = 64;

  for (const colorObj of colorArray) {
    const { color } = colorObj;
    const [r, g, b] = color.match(/\d+/g).map(Number);

    // Calculate saturation and brightness using the formulas
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = (max - min) / 255;
    const saturation = delta * 100;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    if (
      saturation >= saturationThreshold &&
      brightness >= brightnessThreshold
    ) {
      const rgbColor = color.replace(/\s/g, ''); // Remove any whitespace characters
      return rgbColor;
    }
  }

  return null;
  // return 'rgb(83, 83, 83)'; return grey to complement black/white/dark covers
}

export const analyseImageColor = async (imageUrl) => {
  const colorArray = await analyze(imageUrl, {
    scale: 0.1,
    ignore: ['rgb(0,0,0)'],
  });
  return extractDominantColor(colorArray);
};

// /**
//  * Takes a rgb color & returns tailwind hex equivalent for a gradient
//  * @function rgbToHex
//  * @param {string} rgbColor  rgb color (eg rgb(n0, n1, n3))
//  * @returns {string} tailwind class (from-[hex color])
//  */
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

// /**
//  * Takes a rgb color & returns hex equivalent
//  * @function rgbToHex
//  * @param {string} rgbColor rgb color (eg rgb(n0, n1, n3))
//  * @returns {string} hex representation
//  */
// export const rgbToHex = (rgbColor) => {
//   // deconstruct the string into the seperate R,G,B values
//   const [red, green, blue] = rgbColor.match(/\d+/g);
//   // Convert RGB to Hex ("+" changes values (letters) to numbers)
//   return (
//     '#' +
//     ((1 << 24) | (+red << 16) | (+green << 8) | +blue).toString(16).slice(1)
//   );
// };
