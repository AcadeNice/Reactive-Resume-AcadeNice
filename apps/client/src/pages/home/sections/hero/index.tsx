/* eslint-disable lingui/text-restrictions */
import { t } from "@lingui/macro";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

import { defaultTiltProps } from "@/client/constants/parallax-tilt";

import { HeroCTA } from "./call-to-action";
import { Decoration } from "./decoration";

export const HeroSection = () => (
  <section id="hero" className="relative">
    <Decoration.Grid />
    <Decoration.Gradient />

    <div className="mx-auto max-w-7xl px-6 lg:flex lg:h-screen lg:items-center lg:px-12">
      <motion.div
        className="mx-auto mt-32 max-w-3xl shrink-0 lg:mx-0 lg:mt-0 lg:max-w-xl lg:pt-8"
        viewport={{ once: true }}
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <div className="mt-10 space-y-2">
          <h6 className="text-base font-bold tracking-wide">{t`Enfin,`}</h6>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {t`Créez un CV qui passe les filtres et attire les recruteurs !`}
          </h1>
        </div>

        <p className="prose prose-base prose-zinc mt-6 text-lg leading-8 dark:prose-invert">
          {t`Pensé pour les étudiants d’AcadéNice, cet outil vous aide à rédiger un CV prêt pour les candidatures, lisible par les recruteurs et les systèmes ATS.`}
        </p>

        <div className="mt-10 flex items-center gap-x-8">
          <HeroCTA />
        </div>
      </motion.div>

      <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-20">
        <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
          <motion.div
            viewport={{ once: true }}
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <Tilt {...defaultTiltProps}>
              <img
                width={3600}
                height={2078}
                src="/screenshots/builder-light.png"
                alt=""
                className="w-[76rem] rounded-lg bg-background/5 shadow-2xl ring-1 ring-foreground/10 dark:hidden"
              />

              <img
                width={3600}
                height={2078}
                src="/screenshots/builder-dark.png"
                alt=""
                className="hidden w-[76rem] rounded-lg bg-background/5 shadow-2xl ring-1 ring-foreground/10 dark:block"
              />
            </Tilt>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);
