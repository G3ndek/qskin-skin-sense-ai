
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-qskyn-primary text-white hover:bg-qskyn-primaryHover shadow-sm",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:text-white dark:hover:bg-red-700",
        outline:
          "border border-pink-200 bg-white hover:bg-pink-50 hover:text-pink-600 dark:border-qskyn-darkBorder dark:bg-qskyn-darkInput dark:text-qskyn-darkHeading dark:hover:bg-qskyn-darkBorder dark:hover:text-qskyn-highlight",
        secondary:
          "bg-pink-400 text-white hover:bg-pink-500 dark:bg-qskyn-secondary dark:text-white dark:hover:bg-qskyn-secondary/80",
        ghost: "hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-qskyn-darkInput dark:hover:text-qskyn-highlight",
        link: "text-blue-500 underline-offset-4 hover:underline dark:text-qskyn-secondary",
        accent: "bg-blue-500 text-white hover:bg-blue-600 dark:bg-qskyn-secondary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
