export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100svh-theme(spacing.16))]">
      <h1 className="text-4xl font-bold mb-4">Welcome to Chess AI</h1>
      <p className="text-lg text-muted-foreground">Select a game mode from the sidebar to start playing.</p>
    </div>
  );
}
