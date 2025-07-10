export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-10 sm:py-12 lg:py-16">
      {children}
    </div>
  );
}
