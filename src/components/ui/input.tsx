import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return <input type={type} data-slot="input" className={cn("flex w-full px-3 py-2  border-b-2 border-gray-300 text-base transition-colors outline-none", "focus:border-rose-500", "placeholder:text-gray-400", className)} {...props} />;
}

export { Input };
