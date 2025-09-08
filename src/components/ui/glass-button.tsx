import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { useSound } from "@/hooks/useSound"
import { cn } from "@/lib/utils"

const glassButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 glass-hover",
  {
    variants: {
      variant: {
        default: "glass-surface text-foreground hover:text-neon-primary",
        primary: "glass-strong text-neon-primary neon-glow hover:neon-glow-strong",
        secondary: "glass-surface text-muted-foreground hover:text-foreground",
        destructive: "glass-surface text-destructive hover:bg-destructive/10",
        outline: "border border-glass-border glass-surface hover:glass-strong",
        ghost: "hover:glass-surface text-foreground",
        neon: "bg-neon-primary text-primary-foreground neon-glow-strong hover:scale-105 hover:shadow-neon-strong",
        premium: "bg-gradient-to-r from-neon-primary to-neon-secondary text-primary-foreground neon-glow-strong hover:scale-105 font-semibold"
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-md px-3",
        lg: "h-14 rounded-lg px-8",
        xl: "h-16 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, asChild = false, onClick, onMouseEnter, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const { playClick, playHover } = useSound();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playClick();
      onClick?.(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      playHover();
      onMouseEnter?.(e);
    };

    return (
      <Comp
        className={cn(glassButtonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        {...props}
      />
    )
  }
)
GlassButton.displayName = "GlassButton"

export { GlassButton, glassButtonVariants }