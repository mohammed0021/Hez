export default function RootLoading() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="bg-primary/10 flex size-12 items-center justify-center rounded-2xl">
          <span className="text-primary text-xl font-bold">H</span>
        </div>
        <div className="flex gap-1">
          <span
            className="bg-primary size-2 animate-bounce rounded-full"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="bg-primary size-2 animate-bounce rounded-full"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="bg-primary size-2 animate-bounce rounded-full"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}
