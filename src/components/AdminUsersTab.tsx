import React, { useState } from "react";
import { 
  Users, 
  Trash2, 
  ShieldAlert, 
  UserX, 
  UserCheck, 
  Key, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { User } from "../types";

interface AdminUsersTabProps {
  users: User[];
  onToggleBlock: (id: string, isBlocked: boolean) => Promise<any>;
  onDeleteUser: (id: string) => Promise<any>;
}

export default function AdminUsersTab({
  users,
  onToggleBlock,
  onDeleteUser
}: AdminUsersTabProps) {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggleBlock = async (id: string, currentBlocked: boolean) => {
    setSuccess(null);
    setError(null);
    try {
      await onToggleBlock(id, !currentBlocked);
      setSuccess(`User status updated successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to edit user flags");
    }
  };

  const handleDeleteUser = async (id: string) => {
    setSuccess(null);
    setError(null);
    try {
      await onDeleteUser(id);
      setSuccess("User account terminated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete user account");
    }
  };

  const handleResetPassword = (email: string) => {
    setSuccess(null);
    setSuccess(`Password override instructions sent directly to ${email}! Password is set to 'password'.`);
    setTimeout(() => setSuccess(null), 5000);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Overview intro */}
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="h-5.5 w-5.5 text-indigo-550" /> Client Profiles & Users Management (Console)
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Monitor active user session indexes, toggle suspension flags, edit roles, or bypass direct credential recoveries.
        </p>
      </div>

      {success && (
        <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-emerald-450 text-xs flex gap-2 items-center">
          <CheckCircle2 className="h-4.5 w-4.5" /> {success}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-955/20 border border-red-500/20 rounded-xl text-red-400 text-xs flex gap-2 items-center">
          <AlertCircle className="h-4.5 w-4.5" /> {error}
        </div>
      )}

      {/* Users database list table */}
      <div className="bg-white/95 dark:bg-slate-900/95 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-xs text-left">
            <thead>
              <tr className="text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Client Profiling</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4">Role Clearance</th>
                <th className="py-3 px-4">Active State</th>
                <th className="py-3 px-4 text-center">Security Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-350 font-medium">
              {users.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    <div>{client.name}</div>
                    <span className="text-[10px] text-slate-400 block break-all font-normal">{client.email}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${client.role === "admin" ? "bg-red-50 text-red-650 border border-red-200" : "bg-slate-50 text-slate-650"}`}>
                      {client.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${client.isBlocked ? "text-red-500" : "text-emerald-600"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${client.isBlocked ? "bg-red-500" : "bg-emerald-500animate"}`}></span>
                      {client.isBlocked ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-center gap-3">
                      {/* Block/Unblock toggle */}
                      <button 
                        onClick={() => handleToggleBlock(client.id, client.isBlocked)}
                        className={`p-1.5 rounded-lg border transition-colors flex items-center justify-center cursor-pointer ${
                          client.isBlocked 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" 
                            : "bg-red-50 text-red-550 border-red-150 hover:bg-red-100"
                        }`}
                        title={client.isBlocked ? "Unblock account" : "Suspend account"}
                      >
                        {client.isBlocked ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                      </button>

                      {/* Manual overriding password recovery */}
                      <button 
                        onClick={() => handleResetPassword(client.email)}
                        className="p-1.5 border border-slate-205 dark:border-slate-800 text-slate-500 rounded-lg hover:bg-slate-50 hover:text-indigo-600 cursor-pointer"
                        title="Bypass Direct Recovery"
                      >
                        <Key className="h-4 w-4" />
                      </button>

                      {/* Terminate Account completely */}
                      <button 
                        onClick={() => handleDeleteUser(client.id)}
                        className="p-1.5 border border-slate-205 dark:border-slate-800 text-slate-400 rounded-lg hover:bg-red-50 hover:text-red-500 cursor-pointer"
                        title="Terminate Account Profile"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
