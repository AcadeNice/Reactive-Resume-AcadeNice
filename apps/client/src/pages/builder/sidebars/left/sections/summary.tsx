import { t } from "@lingui/macro";
import { defaultSections } from "@reactive-resume/schema";
import { RichInput } from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";

import { AiActions } from "@/client/components/ai-actions";
import { useResumeStore } from "@/client/stores/resume";

import { SectionIcon } from "./shared/section-icon";
import { SectionOptions } from "./shared/section-options";

export const SummarySection = () => {
  const setValue = useResumeStore((state) => state.setValue);
  const section = useResumeStore(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (state) => state.resume.data.sections.summary ?? defaultSections.summary,
  );

  return (
    <section
      id="summary"
      className="grid gap-y-6"
      aria-labelledby="summary-title"
      aria-label={t`Section Résumé du CV`}
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <SectionIcon id="summary" size={18} aria-label={t`Icône de la section Résumé`} />
          <h2 id="summary-title" className="line-clamp-1 text-2xl font-bold lg:text-3xl">
            {section.name}
          </h2>
        </div>

        <div className="flex items-center gap-x-2">
          <SectionOptions id="summary" aria-label={t`Options pour la section Résumé`} />
        </div>
      </header>

      <main
        className={cn(!section.visible && "opacity-50")}
        role="group"
        aria-label={t`Contenu éditable du résumé`}
      >
        <RichInput
          content={section.content}
          aria-label={t`Éditeur de texte pour le résumé`}
          footer={(editor) => (
            <AiActions
              value={editor.getText()}
              aria-label={t`Actions d'aide par intelligence artificielle pour le résumé`}
              onChange={(value) => {
                editor.commands.setContent(value, true);
                setValue("sections.summary.content", value);
              }}
            />
          )}
          onChange={(value) => {
            setValue("sections.summary.content", value);
          }}
        />
      </main>
    </section>
  );
};
