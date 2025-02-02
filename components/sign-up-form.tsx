// components/Signup.tsx
"use client"; // Utilisé pour les composants côté client

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { ImAppleinc } from "react-icons/im";

export function Signup() {


  return (
    <div className="flex  items-center justify-center   ">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle >
            Créer un compte
          </CardTitle>
          <CardDescription  >
            Inscrivez-vous avec votre email ou via un fournisseur tiers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Formulaire Email/Password */}
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email


                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                />

              </Label>
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Mot de passe"
                required
              />
            </div>
            <Button type="submit" className="w-full" >
              {"S'inscrire"}
            </Button>
          </form>

          {/* Séparateur */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continuez avec
              </span>
            </div>
          </div>

          {/* Boutons OAuth2 */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
            >
              Se connecter avec Apple
              <ImAppleinc />

            </Button>
            <Button
              variant="outline"
              className="w-full"
            >
              Se connecter avec Google
              <FcGoogle />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Déjà inscrit ?{" "}
          <Link
            href="/login" className="text-primary underline"
          >
            Connectez-vous
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
