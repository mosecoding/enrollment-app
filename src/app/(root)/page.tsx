import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <section className="min-h-[calc(100vh-4rem)] content-center">
      <div className="py-16 px-5 space-y-8 sm:space-y-9 lg:space-y-10">
        <hgroup className="max-w-lg mx-auto space-y-3 text-center sm:space-y-3.5 lg:max-w-2xl lg:space-y-4">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            ¡Última Oportunidad para Matricularte!
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl lg:text-2xl">
            Matricúlate antes de que se acaben las vacantes.
          </p>
        </hgroup>
        <div className="flex flex-col justify-center gap-1.5 min-[480px]:flex-row min-[480px]:gap-2 sm:gap-3">
          <Button
            asChild
            className="w-full h-10 sm:h-11 sm:text-base md:w-fit lg:h-12 lg:text-lg"
          >
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button
            variant="outline"
            className="w-full h-10 sm:h-11 sm:text-base md:w-fit lg:h-12 lg:text-lg"
            asChild
          >
            <Link href="/register">Registrarme</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
