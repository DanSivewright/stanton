export const metadata = {
  title: 'Qatalog · Stanton Asset Management',
  description: 'Airy directory mockup for Stanton asset management',
}

export default function QatalogLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-bg-white-0 text-text-strong-950">{children}</div>
}
