import * as React from "react"
import { BREAKPOINTS } from "@/lib/config"

export type DeviceType = 'mobile' | 'tablet' | 'ipad' | 'desktop' | 'large'

export function useDeviceType() {
  const [deviceType, setDeviceType] = React.useState<DeviceType | undefined>(undefined)

  React.useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isPortrait = height > width
      
      // Mobile detection (phones)
      if (width < BREAKPOINTS.mobile || 
          (width < BREAKPOINTS.tablet && isPortrait) ||
          height < BREAKPOINTS.mobile) {
        setDeviceType('mobile')
        return
      }
      
      // iPad detection (768px - 1366px range)
      if (width >= BREAKPOINTS.mobile && width <= BREAKPOINTS.ipad) {
        setDeviceType('ipad')
        return
      }
      
      // Tablet detection (1024px - 1440px range)
      if (width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop) {
        setDeviceType('tablet')
        return
      }
      
      // Large screens
      if (width >= BREAKPOINTS.large) {
        setDeviceType('large')
        return
      }
      
      // Default to desktop
      setDeviceType('desktop')
    }
    
    // Create media query listeners
    const mobileQuery = window.matchMedia(`(max-width: ${BREAKPOINTS.mobile - 1}px)`)
    const tabletQuery = window.matchMedia(`(max-width: ${BREAKPOINTS.tablet - 1}px)`)
    const ipadQuery = window.matchMedia(`(max-width: ${BREAKPOINTS.ipad}px)`)
    const desktopQuery = window.matchMedia(`(max-width: ${BREAKPOINTS.desktop - 1}px)`)
    const orientationQuery = window.matchMedia('(orientation: portrait)')
    const heightQuery = window.matchMedia(`(max-height: ${BREAKPOINTS.mobile - 1}px)`)
    
    const onChange = () => checkDeviceType()
    
    // Listen to all relevant changes
    mobileQuery.addEventListener("change", onChange)
    tabletQuery.addEventListener("change", onChange)
    ipadQuery.addEventListener("change", onChange)
    desktopQuery.addEventListener("change", onChange)
    orientationQuery.addEventListener("change", onChange)
    heightQuery.addEventListener("change", onChange)
    
    // Initial check
    checkDeviceType()
    
    return () => {
      mobileQuery.removeEventListener("change", onChange)
      tabletQuery.removeEventListener("change", onChange)
      ipadQuery.removeEventListener("change", onChange)
      desktopQuery.removeEventListener("change", onChange)
      orientationQuery.removeEventListener("change", onChange)
      heightQuery.removeEventListener("change", onChange)
    }
  }, [])

  return deviceType
}

export function useIsIpad() {
  const deviceType = useDeviceType()
  return deviceType === 'ipad'
}

export function useIsMobileOrTablet() {
  const deviceType = useDeviceType()
  return deviceType === 'mobile' || deviceType === 'ipad'
}