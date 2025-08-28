import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { ManageUsers } from "@/components/ManageUsers";

const prisma = new PrismaClient();

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const pendingUsers = await prisma.user.findMany({
    where: {
      status: "PENDING",
      role: "USER"
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Pending Users
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Approve or reject user registration requests
            </p>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <ManageUsers users={pendingUsers} />
        </div>
      </div>
    </div>
  );
}
