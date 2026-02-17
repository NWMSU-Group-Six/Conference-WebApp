// src/pages/Submission/Submission.tsx
import styles from "./Submission.module.css";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Submission() {
  return (
    <div>
      {/* Hero / Banner */}
      <section className={`${styles.hero} py-16 text-white`}>
        <div className={styles.container}>
          <h1 className="text-center text-4xl font-bold tracking-tight">
            Paper Submission
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/80">
            Submit your full paper (PDF) for Northwest Conference 2026.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-gray-50 py-12">
        <div className={styles.container}>
          <div className="mx-auto max-w-3xl space-y-8">
            {/* Paper Details (outline only) */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#0B6B3A]">Paper Details</CardTitle>
                <CardDescription>
                  Basic info about your submission (outline for now).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="h-10 w-full rounded-md border bg-white" />
                  <div className="h-10 w-full rounded-md border bg-white" />
                  <div className="h-32 w-full rounded-md border bg-white" />
                </div>
              </CardContent>
            </Card>

            {/* Authors (outline only) */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#0B6B3A]">Authors</CardTitle>
                <CardDescription>
                  Add author details (outline for now).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="rounded-xl border bg-white p-4">
                    <div className="mb-3 text-sm font-medium">Author 1</div>
                    <div className="space-y-3">
                      <div className="h-10 w-full rounded-md border" />
                      <div className="h-10 w-full rounded-md border" />
                      <div className="h-10 w-full rounded-md border" />
                    </div>
                  </div>

                  <Button variant="secondary" disabled>
                    + Add author (coming soon)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upload (outline only) */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#0B6B3A]">Upload PDF</CardTitle>
                <CardDescription>
                  PDF only, max size will be enforced later.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-32 items-center justify-center rounded-xl border border-dashed bg-white text-sm text-muted-foreground">
                  Upload area (placeholder)
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline">Cancel</Button>
              <Button
                className="bg-gray-200 text-[#0B6B3A] hover:bg-gray-300"
                disabled
              >
                Submit (mock)
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
