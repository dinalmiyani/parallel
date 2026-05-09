import PublicNavbar from "@/components/public-navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 pt-14">
        {children}
      </main>
    </div>
  );
}