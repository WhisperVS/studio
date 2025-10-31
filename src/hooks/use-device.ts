import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '@/lib/config';

type DeviceType = 'mobile' | 'tablet' | 'ipad' | 'desktop' | 'large';

export function useDeviceType(): DeviceType | null {
  const [deviceType, setDeviceType] = useState<DeviceType | null>(null);

  useEffect(() => {
    const checkDeviceType = (): DeviceType => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Mobile: Width < 768px OR height < 768px (for landscape phones)
      if (width < BREAKPOINTS.mobile || height < BREAKPOINTS.mobile) {
        return 'mobile';
      }
      
      // iPad: Width between 768px-1366px AND height > 768px
      if (width >= BREAKPOINTS.mobile && width <= BREAKPOINTS.ipad && height > BREAKPOINTS.mobile) {
        return 'ipad';
      }
      
      // Tablet: Width between 768px-1024px (general tablet range)
      if (width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet) {
        return 'tablet';
      }
      
      // Large screens: Width > 1920px
      if (width > BREAKPOINTS.large) {
        return 'large';
      }
      
      // Default to desktop for everything else
      return 'desktop';
    };

    // Set initial device type
    setDeviceType(checkDeviceType());

    // Listen for resize events
    const handleResize = () => {
      setDeviceType(checkDeviceType());
    };

    // Listen for orientation changes (important for tablets/iPads)
    const handleOrientationChange = () => {
      // Small delay to ensure dimensions are updated after orientation change
      setTimeout(() => {
        setDeviceType(checkDeviceType());
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return deviceType;
}