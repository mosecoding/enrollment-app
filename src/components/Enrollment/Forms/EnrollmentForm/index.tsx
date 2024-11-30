"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { enrollmentSchema } from "./schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { createEnrollment } from "@/actions/enrollment";

interface Section {
  id: number;
  name: string;
  vacancies: number;
}

interface Grade {
  id: number;
  name: string;
  levelId: number;
  sections: Section[];
}

interface Level {
  id: number;
  name: string;
  grades: Grade[];
}

interface EnrollmentFormProps {
  levels: Level[] | null;
}

const SelectField = ({
  label,
  value,
  onValueChange,
  options,
  disabled,
  placeholder,
}: {
  label: string;
  value: string | undefined;
  onValueChange: (value: string) => void;
  options: Array<{ name: string; vacancies?: number }>;
  disabled: boolean;
  placeholder: string;
}) => (
  <FormItem>
    <FormLabel>{label}</FormLabel>
    <Select onValueChange={onValueChange} value={value} disabled={disabled}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.name} value={option.name}>
            {option.name}
            {option.vacancies !== undefined && (
              <span className="px-2 text-xs uppercase font-medium text-gray-500">
                ({option.vacancies} vacantes)
              </span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <FormMessage />
  </FormItem>
);

export default function EnrollmentForm({ levels }: EnrollmentFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof enrollmentSchema>>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      level: { id: "", name: "" },
      grade: { id: "", name: "" },
      section: { id: "", name: "" },
    },
  });

  const { control, handleSubmit, setValue, trigger } = form;
  const level = useWatch({ control, name: "level" });
  const grade = useWatch({ control, name: "grade" });

  if (!levels) return null;

  const selectedLevel = levels.find((l) => l.name === level?.name);
  const grades = selectedLevel ? selectedLevel.grades : [];
  const selectedGrade = grades.find((g) => g.name === grade?.name);
  const sections = selectedGrade
    ? [...selectedGrade.sections].sort((a, b) => a.name.localeCompare(b.name))
    : [];

  async function onSubmit(values: z.infer<typeof enrollmentSchema>) {
    setError(null);
    startTransition(async () => {
      const response = await createEnrollment(values);
      if (response.error) {
        setError(response.error);
      } else {
        router.push("/enrollment");
      }
    });
  }

  return (
    <section className="max-w-md min-h-[calc(100vh-4rem)] mx-auto content-center">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="px-5 py-16 space-y-6">
        <h1 className="text-3xl text-center font-bold">Matrícula</h1>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={control}
                name="level"
                render={() => (
                  <SelectField
                    label="Nivel"
                    value={level?.name}
                    onValueChange={(value) => {
                      const selected = levels.find((l) => l.name === value);
                      setValue(
                        "level",
                        selected
                          ? { id: String(selected.id), name: selected.name }
                          : { id: "", name: "" }
                      );
                      setValue("grade", { id: "", name: "" });
                      setValue("section", { id: "", name: "" });
                      trigger("level");
                    }}
                    options={levels.map((l) => ({ name: l.name }))}
                    disabled={false}
                    placeholder="Seleccione un nivel"
                  />
                )}
              />

              {selectedLevel && (
                <FormField
                  control={control}
                  name="grade"
                  render={() => (
                    <SelectField
                      label="Grado"
                      value={grade?.name}
                      onValueChange={(value) => {
                        const selected = grades.find((g) => g.name === value);
                        setValue(
                          "grade",
                          selected
                            ? { id: String(selected.id), name: selected.name }
                            : { id: "", name: "" }
                        );
                        setValue("section", { id: "", name: "" });
                        trigger("grade");
                      }}
                      options={grades.map((g) => ({ name: g.name }))}
                      disabled={!selectedLevel}
                      placeholder="Seleccione un grado"
                    />
                  )}
                />
              )}

              {selectedGrade && (
                <FormField
                  control={control}
                  name="section"
                  render={() => (
                    <SelectField
                      label="Sección"
                      value={form.getValues("section")?.name}
                      onValueChange={(value) => {
                        const selected = sections.find((s) => s.name === value);
                        setValue(
                          "section",
                          selected
                            ? { id: String(selected.id), name: selected.name }
                            : { id: "", name: "" }
                        );
                        trigger("section");
                      }}
                      options={sections.map((s) => ({
                        name: s.name,
                        vacancies: s.vacancies,
                      }))}
                      disabled={!selectedGrade}
                      placeholder="Seleccione una sección"
                    />
                  )}
                />
              )}
            </div>
            {isPending ? (
              <Button className="w-full" disabled={isPending}>
                Matriculándote...
              </Button>
            ) : (
              <Button className="w-full" type="submit" disabled={isPending}>
                Matricularme
              </Button>
            )}
          </form>
        </Form>
      </div>
    </section>
  );
}
