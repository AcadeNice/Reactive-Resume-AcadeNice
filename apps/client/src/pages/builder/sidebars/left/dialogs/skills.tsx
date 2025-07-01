import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { X } from "@phosphor-icons/react";
import { defaultSkill, skillSchema } from "@reactive-resume/schema";
import {
  Badge,
  BadgeInput,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Slider,
} from "@reactive-resume/ui";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { SectionDialog } from "../sections/shared/section-dialog";

const formSchema = skillSchema;

type FormValues = z.infer<typeof formSchema>;

export const SkillsDialog = () => {
  const form = useForm<FormValues>({
    defaultValues: defaultSkill,
    resolver: zodResolver(formSchema),
  });

  const [pendingKeyword, setPendingKeyword] = useState("");

  return (
    <SectionDialog<FormValues>
      id="skills"
      form={form}
      defaultValues={defaultSkill}
      pendingKeyword={pendingKeyword}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="skill-name">{t`Name`}</FormLabel>
              <FormControl>
                <Input {...field} id="skill-name" aria-label={t`Nom de la compétence`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="skill-description">{t`Description`}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="skill-description"
                  aria-label={t`Description de la compétence`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="level"
          control={form.control}
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel htmlFor="skill-level">{t`Level`}</FormLabel>
              <FormControl className="py-2">
                <div className="flex items-center gap-x-4">
                  <Slider
                    {...field}
                    id="skill-level"
                    min={0}
                    max={5}
                    value={[field.value]}
                    orientation="horizontal"
                    aria-label={t`Niveau de compétence de 0 à 5`}
                    onValueChange={(value) => {
                      field.onChange(value[0]);
                    }}
                  />

                  {field.value > 0 ? (
                    <span className="text-base font-bold" aria-live="polite" aria-atomic="true">
                      {field.value}
                    </span>
                  ) : (
                    <span className="text-base font-bold" aria-live="polite" aria-atomic="true">
                      {t`Hidden`}
                    </span>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="keywords"
          control={form.control}
          render={({ field }) => (
            <div className="space-y-3 sm:col-span-2">
              <FormItem>
                <FormLabel htmlFor="skill-keywords">{t`Keywords`}</FormLabel>
                <FormControl>
                  <BadgeInput
                    {...field}
                    id="skill-keywords"
                    aria-label={t`Mots-clés pour la compétence`}
                    setPendingKeyword={setPendingKeyword}
                  />
                </FormControl>
                <FormDescription>
                  {t`You can add multiple keywords by separating them with a comma or pressing enter.`}
                </FormDescription>
                <FormMessage />
              </FormItem>

              <div
                className="flex flex-wrap items-center gap-x-2 gap-y-3"
                aria-live="polite"
                aria-atomic="true"
              >
                <AnimatePresence>
                  {field.value.map((item, index) => (
                    <motion.div
                      key={item}
                      layout
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
                      exit={{ opacity: 0, x: -50 }}
                    >
                      <Badge
                        className="cursor-pointer"
                        role="button"
                        tabIndex={0}
                        aria-label={t`Supprimer le mot-clé ${item}`}
                        onClick={() => {
                          field.onChange(field.value.filter((v) => item !== v));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            field.onChange(field.value.filter((v) => item !== v));
                          }
                        }}
                      >
                        <span className="mr-1">{item}</span>
                        <X size={12} weight="bold" />
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        />
      </div>
    </SectionDialog>
  );
};
