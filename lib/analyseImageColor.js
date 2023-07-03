import analyze from 'rgbaster';

/**
 * Takes array of rgb color objects & returns the most dominante color within 
 * a certain range (avoid return too darker colors) otherwise GREY
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
  // return null; // theresfor random color in components not be used at present !!!
  return 'rgb(83, 83, 83)'; // return grey to complement black/white/dark covers
}

export const analyseImageColor = async (imageUrl) => {
  const colorArray = await analyze(imageUrl, {
    scale: 0.1,
    ignore: ['rgb(0,0,0)'],
  });
  return extractDominantColor(colorArray);
};
