export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <h1>Layout pa</h1>
      {children}
    </div>
  );
}


