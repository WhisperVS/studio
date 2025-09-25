import * as React from 'react'

// Slot fallback that forwards refs and accepts arbitrary props so it
// resembles the Radix Slot component well enough for typing purposes.
export const Slot = React.forwardRef<HTMLElement, React.PropsWithChildren<Record<string, unknown>>>((props, ref) => {
  const { children, ...rest } = props as any
  return (
    // eslint-disable-next-line jsx-a11y/aria-role
    <span ref={ref as any} {...rest as any}>
      {children}
    </span>
  )
})

Slot.displayName = 'Slot'

export default Slot
