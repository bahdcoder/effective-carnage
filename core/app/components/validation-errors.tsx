import { Callout } from "@/app/ui/callout"
import type { ServerResponse } from "@/modules/http/types/server-response.types"
import { AlertCircle, XIcon } from "lucide-react"

export interface ValidationErrorsProps {
  response?: ServerResponse
}

export interface ValidationErrorsForFieldProps {
  field?: string
  response?: ServerResponse
}

export function ValidationErrorsForField({
  field,
  response,
}: ValidationErrorsForFieldProps) {
  if (!field) {
    return null
  }

  const errors = response?.errors?.[field]

  if (!errors || errors.length === 0) {
    return null
  }

  return (
    <ul className="flex flex-col gap-1">
      {errors?.map((error) => (
        <li className="text-red-500 text-xs flex items-start gap-1" key={error}>
          <XIcon className="w-3 h-3 mt-0.5" />
          {error}
        </li>
      ))}
    </ul>
  )
}

export function ServerErrorMessage({ response }: ValidationErrorsProps) {
  if (!response) {
    return null
  }

  return (
    <Callout type="danger" icon={<AlertCircle className="text-background" />}>
      <p className="text-background text-sm">{response.message}</p>
      <p className="text-background text-xs mt-2">{response.description}</p>
    </Callout>
  )
}
