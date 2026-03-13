import ResidentProfileClient from "@/components/residents/ResidentProfileClient";

/**
 * PUBLIC_INTERFACE
 * Required for Next.js static export (`output: "export"`) when using a dynamic segment.
 * We pre-render a small demo set of resident IDs.
 */
export function generateStaticParams(): Array<{ id: string }> {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default async function ResidentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ResidentProfileClient id={id} />;
}
