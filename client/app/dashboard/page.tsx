import { auth, currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { orgId, orgRole } = await auth();
  const user = await currentUser();
  const isOwner = orgRole === "org:admin";

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {user?.firstName || "User"}!
        </h1>
        <p className="text-slate-500">
          Workspace: <span className="font-semibold text-indigo-600">
            {isOwner ? "My Private Workspace" : "Team Workspace"}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-white rounded-xl border shadow-sm">
          <p className="text-sm font-medium text-slate-500">Active Projects</p>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>
        <div className="p-6 bg-white rounded-xl border shadow-sm">
          <p className="text-sm font-medium text-slate-500">Open Issues</p>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>
        <div className="p-6 bg-white rounded-xl border shadow-sm">
          <p className="text-sm font-medium text-slate-500">Team Members</p>
          <p className="text-2xl font-bold mt-1">{orgId ? "Multiple" : "Just You"}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
        <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No projects yet</h3>
        <p className="text-slate-500 mb-6 max-w-sm">
          Get started by creating your first project in this workspace.
        </p>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
          Create New Project
        </button>
      </div>
    </div>
  );
}
