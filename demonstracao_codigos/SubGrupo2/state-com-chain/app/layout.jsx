import "../styles.css";

export const metadata = {
  title: "Burburinho | State + Chain of Responsibility",
  description: "Demonstração do padrão State combinado com Chain of Responsibility.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
