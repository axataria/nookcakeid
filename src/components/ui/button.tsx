import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-control px-5 text-sm font-medium transition-[background-color,color,border-color,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burnt-caramel focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-oatmeal disabled:pointer-events-none disabled:opacity-50 active:scale-tactile",
  {
    variants: {
      variant: {
        default:
          "bg-ink-espresso text-canvas-oatmeal hover:bg-burnt-deep",
        caramel:
          "bg-burnt-caramel text-white hover:bg-burnt-deep",
        outline:
          "border border-border-subtle bg-card-linen text-ink-espresso hover:bg-card-subtle",
        ghost:
          "text-ink-espresso hover:bg-card-subtle hover:text-burnt-deep",
        destructive:
          "bg-status-danger text-white hover:bg-status-danger-strong",
      },
      size: {
        default: "h-12",
        sm: "h-10 min-h-10 px-4 text-xs",
        lg: "h-14 min-h-14 px-7 text-base",
        icon: "size-12 min-h-12 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
