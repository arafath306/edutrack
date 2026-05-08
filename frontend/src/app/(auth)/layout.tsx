export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
           <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
             <span className="text-primary-foreground font-bold text-2xl">E</span>
           </div>
           <h1 className="text-3xl font-bold tracking-tight">EduTrack</h1>
           <p className="text-muted-foreground mt-2">The future of educational productivity</p>
        </div>
        {children}
      </div>
    </div>
  );
}
