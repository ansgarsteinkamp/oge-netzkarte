import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback() {
   return (
      <main className="min-h-screen bg-background text-foreground">
         <div className="flex min-h-screen flex-col items-start justify-center gap-4 p-6" role="alert" aria-live="assertive">
            <h1 className="text-sm font-normal text-muted-foreground">Etwas ist schiefgelaufen.</h1>
            <button
               className="inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-muted px-3 text-xs font-medium text-foreground transition-colors hover:border-primary/70 hover:bg-primary/20 hover:text-secondary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
               onClick={() => window.location.reload()}
               type="button"
            >
               Neu laden
            </button>
         </div>
      </main>
   );
}

export default function AppErrorBoundary({ children }) {
   return (
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={error => console.error(error)}>
         {children}
      </ErrorBoundary>
   );
}
