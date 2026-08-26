import { useEffect, useRef } from "react";

interface UseModalA11yOptions {
  isOpen: boolean;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Shared behavior for modals/dialogs rendered via a portal on the Wallet page:
 * - Locks background scroll (with scrollbar-width compensation to avoid layout shift).
 * - Restores original scroll behavior on close/unmount.
 * - Traps focus inside the dialog and closes on Escape.
 * - Moves focus into the dialog on open and restores it to the trigger on close.
 *
 * Attach the returned `dialogRef` to the element that has `role="dialog"`.
 */
export function useModalA11y({ isOpen, onClose }: UseModalA11yOptions) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const body = document.body;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const dialog = dialogRef.current;
    const getFocusable = () =>
      dialog
        ? Array.from(
            dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
          ).filter((el) => el.offsetParent !== null)
        : [];

    // Move focus into the dialog (container is tabIndex=-1; any autoFocus
    // inside will then take over, e.g. the amount input).
    dialog?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is outside this dialog (e.g. a dialog stacked on top).
      if (!dialog?.contains(document.activeElement)) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }

      if (e.key === "Tab") {
        const items = getFocusable();
        if (items.length === 0) {
          e.preventDefault();
          return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  return { dialogRef };
}
