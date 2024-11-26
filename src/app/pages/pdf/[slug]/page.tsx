import PdfViewer from "./PdfViewer";

export default async function Page({ params, }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug


    return <div>
        <PdfViewer fileName={slug} />
    </div>
}