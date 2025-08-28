"use client";

import { User } from "@prisma/client";
import { useState } from "react";

interface ManageUsersProps {
  users: User[];
}

export function ManageUsers({ users: initialUsers }: ManageUsersProps) {
  const [users, setUsers] = useState(initialUsers);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const handleAction = async (userId: string, action: "APPROVED" | "REJECTED") => {
    setIsLoading((prev) => ({ ...prev, [userId]: true }));

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });

      if (!res.ok) {
        throw new Error("Failed to update user status");
      }

      // Remove the user from the list after successful action
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status");
    }

    setIsLoading((prev) => ({ ...prev, [userId]: false }));
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No pending user requests
      </div>
    );
  }

  return (
    <div className="min-w-full divide-y divide-gray-300">
      <div className="grid grid-cols-4 gap-4 bg-gray-50 py-3.5 px-4 text-sm font-semibold text-gray-900">
        <div>Name</div>
        <div>Email</div>
        <div>Requested</div>
        <div>Actions</div>
      </div>
      <div className="divide-y divide-gray-200 bg-white">
        {users.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-4 gap-4 py-4 px-4 text-sm"
          >
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-gray-500">{user.email}</div>
            <div className="text-gray-500">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAction(user.id, "APPROVED")}
                disabled={isLoading[user.id]}
                className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:bg-gray-400"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(user.id, "REJECTED")}
                disabled={isLoading[user.id]}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-gray-400"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
