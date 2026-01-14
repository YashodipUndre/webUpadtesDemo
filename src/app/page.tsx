"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth, Role } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export default function RoleSelectionPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleRoleSelect = async (role: Role, email: string) => {
    // We use the dummy login function to set the role context
    await login(email, role);

    // Then navigate to the appropriate dashboard
    if (role === 'admin') router.push('/admin');
    else if (role === 'reviewer') router.push('/reviewer');
    else if (role === 'developer') router.push('/developer');
    else if (role === 'client') router.push('/client');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
          Select Role
        </h1>
        <p className="text-slate-500 font-medium">
          Choose your workspace to continue
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {[
          { id: 'admin', label: 'Admin', email: 'admin@dummy.com' },
          { id: 'reviewer', label: 'Reviewer', email: 'reviewer1@dummy.com' },
          { id: 'developer', label: 'Developer', email: 'developer1@dummy.com' },
          { id: 'client', label: 'Client', email: 'user@example.com' },
        ].map((role) => (
          <Button
            key={role.id}
            onClick={() => handleRoleSelect(role.id as Role, role.email)}
            variant="outline"
            className="w-full h-auto py-2.5 text-sm font-bold bg-white border border-yellow-400 text-slate-900 hover:bg-yellow-50 hover:text-slate-900 hover:border-yellow-500 shadow-sm transition-all active:scale-95"
          >
            {role.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
