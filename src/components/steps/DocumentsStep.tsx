import type { DocumentItem } from '../../types/vendor'
import type { DocumentsStepProps } from '../../types/vendor'
import DocumentUpload from './inputs/DocumentUpload'

const DEFAULT_REQUIRED_TYPES = [
  { type: 'contract', label: 'Contract' },
  { type: 'taxCertificate', label: 'Tax certificate' },
  { type: 'insurance', label: 'Insurance' },
]

function findDocument(documents: DocumentItem[], type: string): DocumentItem | undefined {
  return documents.find((d) => d.type === type)
}

export default function DocumentsStep({
  documents,
  onDocumentsChange,
  requiredTypes,
  errors = {},
  className = '',
}: DocumentsStepProps) {
  const typesWithLabels =
    requiredTypes?.map((t) => ({
      type: t,
      label: t.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
    })) ?? DEFAULT_REQUIRED_TYPES

  const addOrUpdateDocument = (type: string, file: File) => {
    const existing = documents.find((d) => d.type === type)
    const next: DocumentItem = existing
      ? { ...existing, name: file.name, file, status: 'uploaded' }
      : {
          id: crypto.randomUUID(),
          type,
          name: file.name,
          file,
          status: 'uploaded',
        }
    const rest = documents.filter((d) => d.type !== type)
    onDocumentsChange([...rest, next])
  }

  const removeDocument = (type: string) => {
    onDocumentsChange(documents.filter((d) => d.type !== type))
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {typesWithLabels.map(({ type, label }) => (
        <DocumentUpload
          key={type}
          type={type}
          label={label}
          document={findDocument(documents, type)}
          onUpload={(file) => addOrUpdateDocument(type, file)}
          onRemove={() => removeDocument(type)}
        />
      ))}
      {errors.documents && (
        <p className="text-sm text-red-600">{errors.documents}</p>
      )}
    </div>
  )
}
