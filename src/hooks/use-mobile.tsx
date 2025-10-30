import * as React from "react"
import { BREAKPOINTS } from "@/lib/config"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isPortrait = height > width
      
      // Consider it mobile if:
      // 1. Width is less than mobile breakpoint (traditional mobile portrait)
      // 2. Width is less than tablet breakpoint AND in portrait mode (tablet in portrait = mobile UX)
      // 3. Height is less than mobile breakpoint (mobile in landscape - iPhone 12 Pro landscape is 844x390)
      const isMobileDevice = width < BREAKPOINTS.mobile || 
                           (width < BREAKPOINTS.tablet && isPortrait) ||
                           height < BREAKPOINTS.mobile
      
      setIsMobile(isMobileDevice)
    }
    
    // Create media query listeners for both width and orientation
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.mobile - 1}px)`)
    const orientationMql = window.matchMedia('(orientation: portrait)')
    const tabletMql = window.matchMedia(`(max-width: ${BREAKPOINTS.tablet - 1}px)`)
    const heightMql = window.matchMedia(`(max-height: ${BREAKPOINTS.mobile - 1}px)`)
    
    const onChange = () => checkMobile()
    
    // Listen to all relevant changes
    mql.addEventListener("change", onChange)
    orientationMql.addEventListener("change", onChange)
    tabletMql.addEventListener("change", onChange)
    heightMql.addEventListener("change", onChange)
    
    // Initial check
    checkMobile()
    
    return () => {
      mql.removeEventListener("change", onChange)
      orientationMql.removeEventListener("change", onChange)
      tabletMql.removeEventListener("change", onChange)
      heightMql.removeEventListener("change", onChange)
    }
  }, [])

  return !!isMobile
}
