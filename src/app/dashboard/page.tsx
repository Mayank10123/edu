import { Navigation } from "@/components/Navigation";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const chapters = await prisma.chapter.findMany({
    include: {
      resources: true,
    },
    orderBy: {
      order: 'asc',
    },
  });

  return (
    <div>
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user.name || session.user.email}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Access educational materials organized by chapters
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {chapter.title}
                  </h3>
                  {chapter.description && (
                    <p className="mt-1 text-gray-600">{chapter.description}</p>
                  )}
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-500">
                      {chapter.resources.length} Resources
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <a
                    href={`/chapters/${chapter.id}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View resources →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
