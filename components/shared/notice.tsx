"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ImportantNotice() {
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Chỉ hiển thị 1 lần
  useEffect(() => {
    const seen = localStorage.getItem("seen_econelo_notice");
    if (!seen) {
      setOpen(true);
      localStorage.setItem("seen_econelo_notice", "true");
    }
  }, []);

  // GSAP bounce effect
  useEffect(() => {
    if (open && popupRef.current) {
      gsap.fromTo(
        popupRef.current,
        { scale: 0.7, opacity: 0, y: -30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "bounce.out",
        }
      );
    }
  }, [open]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        ref={popupRef}
        className="
          max-w-lg p-6 text-center bg-white border border-yellow-300 shadow-xl 
          rounded-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-red-600">
            Wichtige Mitteilung zur Marke ECONELO
          </DialogTitle>
          <DialogDescription asChild>
            <div className="text-gray-800 mt-3 space-y-2 text-sm md:text-base leading-relaxed">
              <p>
                Die <strong>Econelo GmbH</strong> befindet sich im
                Insolvenzverfahren. Die Marke <strong>ECONELO</strong> wird ab
                sofort von der <strong>Prestige Home GmbH</strong>{" "}
                weitergeführt.
              </p>
              <p>
                Der Vertrieb der Produkte erfolgt wie gewohnt unter dem
                bekannten Markennamen.
              </p>
              <p>
                Für Reparaturservice wenden Sie sich bitte an:{" "}
                <strong>Herr Frank Rafael</strong>
              </p>
              <p>
                📞{" "}
                <a
                  href="tel:+491716133971"
                  className="text-blue-600 hover:underline"
                >
                  +49 1716 133971
                </a>{" "}
                📧{" "}
                <a
                  href="mailto:frank@frawa-aktiv.de"
                  className="text-blue-600 hover:underline"
                >
                  frank@frawa-aktiv.de
                </a>
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex justify-center">
          <Button
            onClick={() => setOpen(false)}
            className="bg-primary text-white hover:bg-primary/90 px-6 py-2 rounded-lg"
          >
            Schließen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
