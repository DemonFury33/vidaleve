"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, Printer, Shield } from "lucide-react"

export default function PrescriptionPage() {
  const params = useParams()
  const prescriptionId = params.id as string

  // Em produção, buscar dados da receita do banco de dados
  const prescription = {
    id: prescriptionId,
    patientName: "Paciente VidaLeve",
    issueDate: new Date().toLocaleDateString('pt-BR'),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    medication: "Análogo GLP-1 (Semaglutida ou Liraglutida)",
    dosage: "Conforme orientação médica",
    instructions: "Administrar conforme prescrição. Manter refrigerado entre 2°C e 8°C.",
    doctorName: "Dr. VidaLeve",
    doctorCRM: "CRM 123456/SP",
    signature: prescriptionId.split('-')[2] || "ASSINATURA",
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Implementar download em PDF
    alert('Download da receita em desenvolvimento')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header com ações */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Receita Digital
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Válida em qualquer farmácia do Brasil
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button 
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>

        {/* Badge de verificação */}
        <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 flex items-center gap-3 print:hidden">
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-emerald-900 dark:text-emerald-100">
              Receita Verificada
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Esta receita possui assinatura digital válida
            </p>
          </div>
        </div>

        {/* Receita */}
        <Card className="border-2 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="border-b border-emerald-100 dark:border-emerald-900 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  🏥 VidaLeve
                </h2>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Receita Digital Médica
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 dark:text-gray-400">ID da Receita</p>
                <p className="font-mono text-sm font-semibold">{prescription.id}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Informações do Paciente */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg border-b pb-2">Dados do Paciente</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Nome</p>
                  <p className="font-semibold">{prescription.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Data de Emissão</p>
                  <p className="font-semibold">{prescription.issueDate}</p>
                </div>
              </div>
            </div>

            {/* Prescrição */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg border-b pb-2">Prescrição Médica</h3>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Medicamento</p>
                  <p className="font-semibold text-lg">{prescription.medication}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Dosagem</p>
                  <p className="font-semibold">{prescription.dosage}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Instruções</p>
                  <p className="font-semibold">{prescription.instructions}</p>
                </div>
              </div>
            </div>

            {/* Validade */}
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                ⏰ Válida até: {prescription.expiryDate}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Esta receita expira em 30 dias a partir da data de emissão
              </p>
            </div>

            {/* Assinatura Digital */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-lg">Assinatura Digital</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Médico Responsável</p>
                  <p className="font-semibold">{prescription.doctorName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{prescription.doctorCRM}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Código de Verificação</p>
                  <p className="font-mono font-semibold text-emerald-600">{prescription.signature}</p>
                </div>
              </div>
            </div>

            {/* Rodapé */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 border-t pt-4">
              <p>Esta é uma receita digital válida em todo território nacional</p>
              <p>Documento gerado eletronicamente por VidaLeve</p>
            </div>
          </CardContent>
        </Card>

        {/* Instruções para uso */}
        <Card className="print:hidden">
          <CardHeader>
            <h3 className="font-semibold">Como usar esta receita</h3>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✅ Apresente esta receita (impressa ou digital) em qualquer farmácia</p>
            <p>✅ O farmacêutico pode verificar a autenticidade pelo código de verificação</p>
            <p>✅ Guarde uma cópia para seus registros pessoais</p>
            <p>⚠️ Esta receita é válida por 30 dias a partir da data de emissão</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
