"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/app/actions/auth.actions";
import { useFormStatus } from "react-dom";
import { ShieldAlert } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      className="w-full bg-[#1A2530] hover:bg-[#2C3E50] text-[#E8E1D5]" 
      disabled={pending}
    >
      {pending ? "Menyimpan..." : "Simpan Password Baru"}
    </Button>
  );
}

export default function ChangePasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function clientAction(formData: FormData) {
    setError(null);
    setFieldErrors({});
    
    const result = await changePassword(null, formData);
    
    if (result?.error) {
      setError(result.error);
    }
    if (result?.fieldErrors) {
      setFieldErrors(result.fieldErrors);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F1EB] p-4 font-sans">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 shadow-sm rounded-none">
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-[#1A2530] text-[#E8E1D5] p-3 rounded-none">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
          <h1 className="text-2xl font-serif text-[#1A2530] tracking-wider mb-2">Keamanan Akun</h1>
          <p className="text-sm text-gray-500">
            Demi keamanan, Anda wajib mengubah password default sebelum mengakses dashboard admin.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 mb-6 text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        <form action={clientAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Password Saat Ini</Label>
            <Input 
              id="currentPassword" 
              name="currentPassword" 
              type="password" 
              placeholder="Masukkan password saat ini" 
              className="rounded-none border-gray-300 focus:border-[#1A2530]"
            />
            {fieldErrors.currentPassword && (
              <p className="text-red-500 text-xs">{fieldErrors.currentPassword[0]}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">Password Baru</Label>
            <Input 
              id="newPassword" 
              name="newPassword" 
              type="password" 
              placeholder="Minimal 6 karakter" 
              className="rounded-none border-gray-300 focus:border-[#1A2530]"
            />
            {fieldErrors.newPassword && (
              <p className="text-red-500 text-xs">{fieldErrors.newPassword[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <Input 
              id="confirmPassword" 
              name="confirmPassword" 
              type="password" 
              placeholder="Ketik ulang password baru" 
              className="rounded-none border-gray-300 focus:border-[#1A2530]"
            />
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-xs">{fieldErrors.confirmPassword[0]}</p>
            )}
          </div>

          <div className="pt-4">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
