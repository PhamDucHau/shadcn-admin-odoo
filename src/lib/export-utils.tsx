import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'

// Simple CSV Export (no external dependencies)
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string = 'export'
) {
  if (data.length === 0) return

  const headers = Object.keys(data[0] as T)
  const csvHeaders = headers.join(',')
  
  const csvRows = data.map(row =>
    headers.map(header => {
      const value = row[header]
      // Handle values with commas, quotes, and newlines
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value ?? ''
    }).join(',')
  )
  
  const csvContent = [csvHeaders, ...csvRows].join('\n')
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Cleanup
  URL.revokeObjectURL(url)
}

// Simple JSON Export
export function exportToJSON<T extends Record<string, any>>(
  data: T[],
  filename: string = 'export'
) {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.json`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

// Export to Excel (simplified version without external dependencies)
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string = 'export'
) {
  // Create a simplified HTML table that can be opened in Excel
  if (data.length === 0) return

  const headers = Object.keys(data[0] as T)
  const tableHtml = `
    <table>
      <thead>
        <tr>
          ${headers.map(header => `<th>${header}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data.map(row =>
          `<tr>
            ${headers.map(header => `<td>${row[header] ?? ''}</td>`).join('')}
          </tr>`
        ).join('')}
      </tbody>
    </table>
  `
  
  const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.xls`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

// Export to PDF (placeholder for now)
export function exportToPDF<T extends Record<string, any>>(
  data: T[],
  filename: string = 'export'
) {
  // For now, export as text. In real implementation, you'd use jsPDF
  const textContent = data.map((row, index) => 
    `${index + 1}. ${JSON.stringify(row, null, 2)}\n`
  ).join('\n')
  
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.txt`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

interface ExportMenuProps {
  data: any[]
  filename?: string
  onExport?: (format: string) => void
  disabled?: boolean
}

export function ExportMenu({ data, filename = 'data', onExport, disabled = false }: ExportMenuProps) {
  const exportOptions = [
    {
      format: 'CSV',
      icon: <FileSpreadsheet className="h-4 w-4" />,
      action: () => exportToCSV(data, filename)
    },
    {
      format: 'Excel',
      icon: <FileSpreadsheet className="h-4 w-4" />,
      action: () => exportToExcel(data, filename)
    },
    {
      format: 'PDF',
      icon: <FileText className="h-4 w-4" />,
      action: () => exportToPDF(data, filename)
    },
    {
      format: 'JSON',
      icon: <FileText className="h-4 w-4" />,
      action: () => exportToJSON(data, filename)
    },
  ]

  if (data.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48" align="end">
        <div className="p-1">
          {exportOptions.map((option) => (
            <Button
              key={option.format}
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                option.action()
                onExport?.(option.format)
              }}
            >
              {option.icon}
              {option.format}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Export individual formats directly
export function CSVExport({ data, filename, disabled }: { data: any[]; filename?: string; disabled?: boolean }) {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => exportToCSV(data, filename)}
      disabled={disabled}
    >
      <FileSpreadsheet className="h-4 w-4 mr-2" />
      CSV
    </Button>
  )
}

export function ExcelExport({ data, filename, disabled }: { data: any[]; filename?: string; disabled?: boolean }) {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => exportToExcel(data, filename)}
      disabled={disabled}
    >
      <FileSpreadsheet className="h-4 w-4 mr-2" />
      Excel
    </Button>
  )
}

export function PDFExport({ data, filename, disabled }: { data: any[]; filename?: string; disabled?: boolean }) {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => exportToPDF(data, filename)}
      disabled={disabled}
    >
      <FileText className="h-4 w-4 mr-2" />
      PDF
    </Button>
  )
}
