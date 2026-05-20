import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function TooltipIconButton({ label, children, className, side = "top", ...props }) {
   return (
      <Tooltip>
         <TooltipTrigger asChild>
            <button
               type="button"
               aria-label={label}
               className={cn(
                  "inline-grid size-9 place-items-center rounded-md border border-border bg-accent text-accent-foreground transition-colors hover:border-primary/70 hover:bg-primary/20 hover:text-secondary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                  className
               )}
               {...props}
            >
               {children}
            </button>
         </TooltipTrigger>
         <TooltipContent side={side}>{label}</TooltipContent>
      </Tooltip>
   );
}
