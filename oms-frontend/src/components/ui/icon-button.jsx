import React from 'react'
import { Button } from './button'

/**
 * IconButton component that combines an icon with button styling
 * Wraps the Button component to handle icon rendering
 */
export const IconButton = React.forwardRef(
  ({ icon: Icon, children, className, ...props }, ref) => {
    return (
      <Button ref={ref} className={className} {...props}>
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        {children}
      </Button>
    )
  }
)

IconButton.displayName = 'IconButton'

/**
 * Simple icon-only button (for toolbars, headers, etc.)
 */
export const IconOnlyButton = React.forwardRef(
  ({ icon: Icon, ...props }, ref) => {
    if (!Icon) {
      console.warn('IconOnlyButton: icon prop is required')
      return null
    }

    return (
      <Button
        ref={ref}
        size="icon"
        {...props}
      >
        <Icon className="h-4 w-4" />
      </Button>
    )
  }
)

IconOnlyButton.displayName = 'IconOnlyButton'
