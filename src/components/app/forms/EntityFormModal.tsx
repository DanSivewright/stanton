"use client";

import * as Button from "@/components/ui/button";
import * as Modal from "@/components/ui/modal";

type EntityFormModalProps = {
  children: React.ReactNode;
  error?: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  open: boolean;
  submitLabel: string;
  submitting?: boolean;
  title: string;
};

export function EntityFormModal({
  children,
  error,
  onOpenChange,
  onSubmit,
  open,
  submitLabel,
  submitting,
  title,
}: EntityFormModalProps) {
  return (
    <Modal.Root onOpenChange={onOpenChange} open={open}>
      <Modal.Content className="max-w-[720px]">
        <Modal.Header title={title} />
        <Modal.Body>
          <div className="space-y-4">
            {children}
            {error ? (
              <p className="text-error-base text-paragraph-sm">{error}</p>
            ) : null}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button.Root mode="stroke" type="button" variant="neutral">
              Cancel
            </Button.Root>
          </Modal.Close>
          <Button.Root
            disabled={Boolean(submitting)}
            onClick={onSubmit}
            type="button"
            variant="primary"
          >
            {submitting ? "Saving..." : submitLabel}
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
