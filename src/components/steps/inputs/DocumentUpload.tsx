import type { DocumentItem } from '../../../types/vendor'

interface DocumentUploadProps {
  type: string
  label: string
  document?: DocumentItem
  onUpload: (file: File) => void
  onRemove: () => void
  error?: string
}

export default function DocumentUpload({
  type: _type,
  label,
  document,
  onUpload,
  onRemove,
  error,
}: DocumentUploadProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
    e.target.value = ''
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {document?.name ? (
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="truncate text-sm text-gray-600">{document.name}</span>
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="mt-2">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            className="block w-full text-sm text-gray-500 file:mr-2 file:rounded file:border-0 file:bg-indigo-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
