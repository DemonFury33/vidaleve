"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function CheckoutCancel() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-red-200 dark:border-red-800">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Pagamento Cancelado</CardTitle>
          <CardDescription className="text-center">
            Você cancelou o processo de pagamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-sm text-center text-gray-600 dark:text-gray-400">
            <p>Nenhuma cobrança foi realizada.</p>
            <p className="mt-2">Você pode tentar novamente quando quiser.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button 
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              onClick={() => router.push('/')}
            >
              Tentar Novamente
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => router.push('/')}
            >
              Voltar ao Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
