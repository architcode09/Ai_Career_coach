import MDEditor from "@uiw/react-md-editor";

export default function CoverLetterPreview({ content }) {
  return (
    <div className="py-4">
      <MDEditor value={content} preview="preview" height={700} />
    </div>
  );
}
