import { useState, useEffect } from 'react';
import { use100vh } from 'react-div-100vh';

type DeviceSize = 'small' | 'medium-small' | 'regular' | 'desktop';

interface UseRealHeightOptions {
  percentage?: number;
  smallPercentage?: number;
  mediumSmallPercentage?: number;
  regularPercentage?: number;
  desktopPercentage?: number;
}

export const useRealHeight = (options: UseRealHeightOptions = {}) => {
  const {
    percentage = 100, // Default to 100% if no specific percentages provided
    smallPercentage = 51,
    mediumSmallPercentage = 62,
    regularPercentage = 62,
    desktopPercentage = 67,
  } = options;

  const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop');
  const viewportHeight = use100vh();

  useEffect(() => {
    const checkDeviceSize = () => {
      const width = window.innerWidth;
      if (width < 376) {
        setDeviceSize('small');
      } else if (width >= 376 && width < 391) {
        setDeviceSize('medium-small');
      } else if (width < 768) {
        setDeviceSize('regular');
      } else {
        setDeviceSize('desktop');
      }
    };

    checkDeviceSize();
    window.addEventListener('resize', checkDeviceSize);
    return () => window.removeEventListener('resize', checkDeviceSize);
  }, []);

  const getHeightPercentage = () => {
    if (percentage !== 100) {
      return percentage / 100;
    }

    switch (deviceSize) {
      case 'small':
        return smallPercentage / 100;
      case 'medium-small':
        return mediumSmallPercentage / 100;
      case 'regular':
        return regularPercentage / 100;
      default:
        return desktopPercentage / 100;
    }
  };

  const heightPercentage = getHeightPercentage();
  const height = viewportHeight ? `${viewportHeight * heightPercentage}px` : `${heightPercentage * 100}vh`;

  return {
    height,
    deviceSize,
    viewportHeight,
  };
}; 