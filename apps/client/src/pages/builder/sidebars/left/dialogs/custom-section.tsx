import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { X } from "@phosphor-icons/react";
import type { CustomSection } from "@reactive-resume/schema";
import { customSectionSchema, defaultCustomSection } from "@reactive-resume/schema";
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
  RichInput,
} from "@reactive-resume/ui";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { AiActions } from "@/client/components/ai-actions";
import { useDialog } from "@/client/stores/dialog";

import { SectionDialog } from "../sections/shared/section-dialog";
import { URLInput } from "../sections/shared/url-input";

const formSchema = customSectionSchema;

type FormValues = z.infer<typeof formSchema>;

export const CustomSectionDialog = () => {
  const { payload } = useDialog<CustomSection>("custom");

  const form = useForm<FormValues>({
    defaultValues: defaultCustomSection,
    resolver: zodResolver(formSchema),
  });

  const [pendingKeyword, setPendingKeyword] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!payload) return null;

  return (
    <SectionDialog<FormValues>
      form={form}
      id={payload.id}
      defaultValues={defaultCustomSection}
      pendingKeyword={pendingKeyword}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Name`}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  aria-label={t({ message: "Nom de la section personnalisée" })}
                  aria-describedby="description-name"
                />
              </FormControl>
              <FormMessage id="description-name" />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Description`}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  aria-label={t({ message: "Description courte de la section personnalisée" })}
                  aria-describedby="description-description"
                />
              </FormControl>
              <FormMessage id="description-description" />
            </FormItem>
          )}
        />

        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Date or Date Range`}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  aria-label={t({ message: "Date ou période associée à cette section" })}
                  aria-describedby="description-date"
                />
              </FormControl>
              <FormMessage id="description-date" />
            </FormItem>
          )}
        />

        <FormField
          name="location"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Location`}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  aria-label={t({ message: "Lieu lié à cette section personnalisée" })}
                  aria-describedby="description-location"
                />
              </FormControl>
              <FormMessage id="description-location" />
            </FormItem>
          )}
        />

        <FormField
          name="url"
          control={form.control}
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>{t`Website`}</FormLabel>
              <FormControl>
                <URLInput
                  {...field}
                  aria-label={t({ message: "Lien vers un site web associé" })}
                  aria-describedby="description-url"
                />
              </FormControl>
              <FormMessage id="description-url" />
            </FormItem>
          )}
        />

        <FormField
          name="summary"
          control={form.control}
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>{t`Summary`}</FormLabel>
              <FormControl>
                <RichInput
                  {...field}
                  aria-label={t({ message: "Résumé ou texte libre pour décrire cette section" })}
                  aria-describedby="description-summary"
                  content={field.value}
                  footer={(editor) => (
                    <AiActions
                      value={editor.getText()}
                      onChange={(value) => {
                        editor.commands.setContent(value, true);
                        field.onChange(value);
                      }}
                    />
                  )}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage id="description-summary" />
            </FormItem>
          )}
        />

        <FormField
          name="keywords"
          control={form.control}
          render={({ field }) => (
            <div className="space-y-3 sm:col-span-2">
              <FormItem>
                <FormLabel>{t`Keywords`}</FormLabel>
                <FormControl>
                  <BadgeInput
                    {...field}
                    setPendingKeyword={setPendingKeyword}
                    aria-label={t({ message: "Mots-clés associés à cette section" })}
                    aria-describedby="description-keywords"
                  />
                </FormControl>
                <FormDescription id="description-keywords">
                  {t`You can add multiple keywords by separating them with a comma or pressing enter.`}
                </FormDescription>
                <FormMessage />
              </FormItem>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
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
                        onClick={() => {
                          field.onChange(field.value.filter((v) => item !== v));
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
