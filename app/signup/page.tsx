// app/signup/page.tsx
"use client"; // Nécessaire pour utiliser des hooks et des interactions

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { AiFillApple } from "react-icons/ai";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    // Validation simple
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};
    if (!email.includes("@")) {
      newErrors.email = "Veuillez entrer une adresse email valide.";
    }
    if (password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      // Soumettre le formulaire (à implémenter)
      console.log("Formulaire soumis avec succès !");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md md:max-w-lg space-y-6 bg-card p-6 sm:p-8 md:p-10 rounded-lg shadow-lg border border-border">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Créez votre compte</h2>
          <p className="text-muted-foreground mt-2 sm:mt-3">
            {"Commencez votre aventure dès aujourd'hui."}
          </p>
        </div>

        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="email" className="text-foreground text-base sm:text-lg">
              Adresse email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="password" className="text-foreground text-base sm:text-lg">
              Mot de passe
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Mot de passe"
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="confirm-password" className="text-foreground text-base sm:text-lg">
              Confirmez le mot de passe
            </Label>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              placeholder="Confirmez le mot de passe"
              className={errors.confirmPassword ? "border-destructive" : ""}
            />
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
          </div>

          <Button type="submit" className="w-full text-base sm:text-lg">
            {"S'inscrire"}
          </Button>
        </form>

        <div className="space-y-4 sm:space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm sm:text-base">
              <span className="px-2 bg-card text-muted-foreground">Ou continuez avec</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Button variant="outline" className="w-full text-base sm:text-lg">
              <FcGoogle className="mr-2 h-5 w-5" />
              Google
            </Button>
            <Button variant="outline" className="w-full text-base sm:text-lg">
              <AiFillApple className="mr-2 h-5 w-5" />
              Apple
            </Button>
          </div>
        </div>

        <div className="text-center text-sm sm:text-base text-muted-foreground">
          Vous avez déjà un compte ?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Connectez-vous
          </Link>
        </div>
      </div>
    </div>
  );
}
