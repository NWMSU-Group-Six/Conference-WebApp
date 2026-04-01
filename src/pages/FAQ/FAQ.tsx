import Hero from "@/components/custom/Hero";
import styles from "./FAQ.module.css";
import type { FAQ } from "@/models/FAQ";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { getDataByCollection } from "@/firebase/db";

export default function FAQ() {
  const [faqList, setFAQList] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDataByCollection<FAQ>("faq")
      .then(setFAQList)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <Hero
        title="Frequently Asked Questions"
        subtitle="This is a list of common questions and answers about the conference."
      />

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 my-10">
        {loading ? (
          <p className="text-center text-gray-500 py-16">Loading speakers…</p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {faqList.map((faq) => (
              <AccordionItem value={faq.question} className="border-b">
                <AccordionTrigger className="text-xl font-semibold py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-lg leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
}
