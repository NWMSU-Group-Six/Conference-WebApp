import styles from "./FAQ.module.css";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <section>
      <section className={styles.heroSection}>
        <div className={styles.cfpContainer}>
          <h1 className={styles.mainHeading}>Frequently Asked Questions</h1>
          <p className={styles.subtitle}>
            This is a list of common questions and answers about the conference.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 my-10">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-b">
            <AccordionTrigger className="text-xl font-semibold py-6">
              When is the submission deadline?
            </AccordionTrigger>

            <AccordionContent className="text-lg leading-relaxed pb-6">
              The submission deadline will be posted on the conference website.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-b">
            <AccordionTrigger className="text-xl font-semibold py-6">
              How do I submit my paper?
            </AccordionTrigger>

            <AccordionContent className="text-lg leading-relaxed pb-6">
              You can submit your paper through the submission page.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-b">
            <AccordionTrigger className="text-xl font-semibold py-6">
              What format should my paper follow?
            </AccordionTrigger>

            <AccordionContent className="text-lg leading-relaxed pb-6">
              All submissions must follow the formatting guidelines provided on
              the Call for Papers page, including page limits, citation style,
              and document format.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-b">
            <AccordionTrigger className="text-xl font-semibold py-6">
              Who is eligible to submit a paper?
            </AccordionTrigger>

            <AccordionContent className="text-lg leading-relaxed pb-6">
              Students, researchers, and professionals are welcome to submit
              papers, provided their work aligns with the topics listed in the
              conference Call for Papers.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border-b">
            <AccordionTrigger className="text-xl font-semibold py-6">
              When will authors be notified of acceptance?
            </AccordionTrigger>
            <AccordionContent className="text-lg leading-relaxed pb-6">
              Authors will receive notification of acceptance or rejection after
              the review process is completed. The notification date will be
              listed on the conference timeline.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
