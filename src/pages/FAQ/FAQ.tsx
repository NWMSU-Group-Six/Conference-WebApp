// src/pages/Submission/Submission.tsx
import styles from "./FAQ.module.css";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
      <p className="text-muted-foreground mb-8">
        Find answers to common questions about submissions, deadlines, and conference details.
      </p>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>When is the submission deadline?</AccordionTrigger>
          <AccordionContent>
            The submission deadline will be posted on the conference website. Please check the
            Call for Papers page for the most current timeline.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>How do I submit my paper?</AccordionTrigger>
          <AccordionContent>
            You can submit your paper through the Submission page by filling out the required
            information and uploading your document.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>What format should my paper be in?</AccordionTrigger>
          <AccordionContent>
            Papers should follow the conference formatting guidelines listed on the Call for Papers
            page. Be sure to review those requirements before submitting.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>Can I edit my submission later?</AccordionTrigger>
          <AccordionContent>
            This depends on the submission system rules. If edits are allowed, instructions will be
            provided on the submission page.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
