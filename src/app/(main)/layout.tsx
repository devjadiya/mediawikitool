export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="py-6 sm:py-8 lg:py-12">
      {children}
    </div>
  );
}
