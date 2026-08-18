import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders an accessible title, description, and action", () => {
    const markup = renderToStaticMarkup(
      <EmptyState
        title="No cars found"
        description="Try adjusting your search."
        action={<a href="/cars">Browse all cars</a>}
      />,
    );

    expect(markup).toContain("aria-labelledby=");
    expect(markup).toContain("aria-describedby=");
    expect(markup).toContain("No cars found");
    expect(markup).toContain("Try adjusting your search.");
    expect(markup).toContain("Browse all cars");
  });

  it("renders without optional content", () => {
    const markup = renderToStaticMarkup(<EmptyState title="No bookings yet" />);

    expect(markup).toContain("No bookings yet");
    expect(markup).not.toContain("aria-describedby");
  });
});