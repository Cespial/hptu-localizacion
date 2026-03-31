import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

type GroupDividerProps = {
  id?: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  accentColor?: string;
};

export function GroupDivider({ id, icon: Icon, title, subtitle, accentColor = "bg-teal-500" }: GroupDividerProps) {
  return (
    <div id={id} className="relative py-8 my-4">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm", accentColor)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className={cn("mt-4 h-0.5 rounded-full opacity-30", accentColor)} />
      </div>
    </div>
  );
}
