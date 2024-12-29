import { Card } from "@/components/ui/card";
export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body className=" bg-cover bg-no-repeat min-h-screen bg-fixed overflow-x-hidden" style={{backgroundImage: "url('/Home_Background_Image.jpg')"}}>
          <main className="flex justify-center items-center h-screen w-full">
            <Card className=" w-2/3 bg-black/80 text-white border-none p-2">
                {children}
            </Card>
          </main>
        </body>
      </html>
    );
  }