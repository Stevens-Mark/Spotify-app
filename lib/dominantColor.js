import getPixels from 'get-pixels';

/**
 * Takes an image onload & returns the most dominante color
 * within a certain range (avoid return too darker colors) otherwise null
 * @function fetchDominantColor
 * @param {string} imageUrl image url
 * @returns {string} rgb color or null
 */
export const fetchDominantColor = async (imageUrl) => {
  try {
    return new Promise((resolve, reject) => {
      getPixels(imageUrl, (err, pixels) => {
        if (err) {
          // console.error('getPixels Error:', err);
          reject(null);
          return;
        }

        const saturationThreshold = 20;
        const brightnessThreshold = 25;
        const darkColorThreshold = 40;

        let sumR = 0;
        let sumG = 0;
        let sumB = 0;
        let count = 0;

        for (let i = 0; i < pixels.data.length; i += 4) {
          const r = pixels.data[i];
          const g = pixels.data[i + 1];
          const b = pixels.data[i + 2];

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const delta = (max - min) / 255;
          const saturation = delta * 100;

          const brightness = (r * 299 + g * 587 + b * 114) / 1000;

          if (
            // saturation >= saturationThreshold &&
            // brightness >= brightnessThreshold
            saturation >= saturationThreshold &&
            brightness >= brightnessThreshold &&
            max >= darkColorThreshold
          ) {
            sumR += r;
            sumG += g;
            sumB += b;
            count++;
          }
        }

        if (count > 0) {
          const averageR = (sumR / count) | 0;
          const averageG = (sumG / count) | 0;
          const averageB = (sumB / count) | 0;
          const colorString = `rgb(${averageR}, ${averageG}, ${averageB})`;
          resolve(colorString);
        } else {
          resolve(null);
        }
      });
    });
  } catch (err) {
    console.error('Error retrieving dominant color:', err);
    return null;
  }
};


