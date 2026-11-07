import type { ReactNode } from "react";
import "./phone.css";

/** Device frame. Width comes from the --phone-w custom property on a parent or itself. */
export function Phone({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="phone" role="group" aria-label={label ?? "Phone preview"}>
      <div className="phone-body">
        <div className="phone-screen">{children}</div>
        <span className="phone-island" aria-hidden="true" />
      </div>
    </div>
  );
}
