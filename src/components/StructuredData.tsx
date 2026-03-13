/**
 * Server-rendered JSON-LD helper component.
 *
 * Responsibilities:
 * - serialize structured data objects into script tags
 * - keep JSON-LD rendering consistent across public pages
 * - avoid duplicating script boilerplate in route components
 */

/**
 * Props accepted by the structured data renderer.
 */
interface StructuredDataProps {
  /** Structured data payload or payloads to serialize into JSON-LD. */
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Renders a JSON-LD script tag for the supplied structured data payload.
 *
 * @param data Structured data object or objects.
 * @returns A script element containing JSON-LD.
 */
export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
