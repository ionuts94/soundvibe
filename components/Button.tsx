import React, { forwardRef } from 'react';

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className, children, disabled, type = "button", ...props
}, ref) => {
  return (
    <button>

    </button>
  )
})

Button.displayName = "Button";
