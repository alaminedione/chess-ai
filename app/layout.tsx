import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"


export const metadata: Metadata = {
  title: "Chess AI",
  description: "Chess AI is a chess game where you play against an AI.",
  keywords: ["chess", "ai", "game", "nextjs app", "artificial intelligence"]
};

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">

      <body>

        <SidebarProvider>
          <AppSidebar />
          <main className="p-3 w-full">
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>

      </body>
    </html>
  )
}
