"use client"

import { createContext, useContext } from "react"
import { cn } from "@/lib/utils"

interface TabsCtx { value: string; onValueChange: (v: string) => void }
const TabsContext = createContext<TabsCtx>({ value: "", onValueChange: () => {} })

function Tabs({ value, onValueChange, children, className }: {
  value: string; onValueChange: (v: string) => void
  children: React.ReactNode; className?: string
}) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("inline-flex h-9 w-full items-center justify-center rounded-lg bg-secondary p-1 text-muted-foreground", className)}>
      {children}
    </div>
  )
}

function TabsTrigger({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const { value: active, onValueChange } = useContext(TabsContext)
  return (
    <button
      onClick={() => onValueChange(value)}
      className={cn(
        "inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none",
        active === value ? "bg-card text-foreground shadow" : "hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}

function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const { value: active } = useContext(TabsContext)
  if (active !== value) return null
  return <div className={cn("mt-2", className)}>{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
