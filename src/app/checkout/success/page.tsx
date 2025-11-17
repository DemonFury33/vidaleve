"use client"

import { Suspense } from "react"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, ExternalLink, Sparkles } from "lucide-react"
import { Alert } from "@/components/ui/alert"

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)
  const [planType, setPlanType] = useState<"basic" | "premium" | null>(null)
  const [checkoutEmail, setCheckoutEmail] = useState<string | null>(null)

  useEffect(() => {
    // Recuperar dados do localStorage e URL
    const savedPlanType = localStorage.getItem('vidaleve_plan_type') as "basic" | "premium" | null
    setPlanType(savedPlanType)

    // Tentar pegar email dos parâmetros da URL (se Kirvano enviar)
    const emailParam = searchParams.get('email') || searchParams.get('customer_email')
    if (emailParam) {
      setCheckoutEmail(emailParam)
    }

    // Simular processamento
    const timer = setTimeout(() => {
      setIsProcessing(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [searchParams])

  const handleGoToAuth = () => {
    // Passar email para página de autenticação se disponível
    if (checkoutEmail) {
      router.push(`/auth?email=${encodeURIComponent(checkoutEmail)}`)
    } else {
      router.push('/auth')
    }
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
              <h3 className="text-xl font-semibold">
                Processando seu pagamento...
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Aguarde enquanto confirmamos seu pagamento e preparamos sua área do cliente
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full border-emerald-200 dark:border-emerald-800">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Pagamento Confirmado!</CardTitle>
          <CardDescription className="text-center">
            Bem-vindo ao VidaLeve! Sua jornada de emagrecimento começa agora
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plano Contratado */}
          <div className={`${planType === "premium" ? "bg-purple-50 dark:bg-purple-950" : "bg-emerald-50 dark:bg-emerald-950"} p-6 rounded-lg space-y-3`}>
            <div className="flex items-center gap-2">
              <Sparkles className={`w-5 h-5 ${planType === "premium" ? "text-purple-600" : "text-emerald-600"}`} />
              <h3 className="text-lg font-semibold">
                {planType === "premium" ? "Plano Premium Ativado" : "Plano Básico Ativado"}
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Você agora tem acesso a:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${planType === "premium" ? "text-purple-600" : "text-emerald-600"}`} />
                Indicação personalizada de análogo GLP-1 com nome comercial e dosagem
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${planType === "premium" ? "text-purple-600" : "text-emerald-600"}`} />
                Plano alimentar personalizado (10 variações)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${planType === "premium" ? "text-purple-600" : "text-emerald-600"}`} />
                Área do cliente com login e senha
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${planType === "premium" ? "text-purple-600" : "text-emerald-600"}`} />
                Acompanhamento de evolução e ajuste de dosagem
              </li>
              {planType === "premium" && (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    Plano de treinos em casa (10+ variações)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    Suporte prioritário
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Email detectado */}
          {checkoutEmail && (
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CheckCircle2 className="w-4 h-4" />
              <div className="ml-2">
                <h5 className="font-semibold text-sm">Email de Pagamento Detectado</h5>
                <p className="text-xs mt-1">
                  Use o email <strong>{checkoutEmail}</strong> para criar sua conta e acessar suas indicações personalizadas.
                </p>
              </div>
            </Alert>
          )}

          {/* Próximos Passos */}
          <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <ExternalLink className="w-4 h-4" />
            <div className="ml-2">
              <h5 className="font-semibold text-sm">Próximo Passo: Consulta Online</h5>
              <p className="text-xs mt-1">
                Para obter sua receita médica válida, agende uma consulta online com nossos médicos parceiros. A consulta é paga à parte.
              </p>
            </div>
          </Alert>

          {/* Botões de Ação */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 py-6"
              onClick={handleGoToAuth}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Criar Conta e Acessar Área do Cliente
            </Button>

            <Button 
              variant="outline"
              className="w-full py-6"
              onClick={() => window.open('https://consultas.nxttelessaude.com.br/busca', '_blank')}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Agendar Consulta Online (Opcional)
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            {checkoutEmail 
              ? `Crie sua conta usando o email ${checkoutEmail} para acessar suas indicações personalizadas`
              : "Crie sua conta para acessar suas indicações personalizadas de GLP-1, plano alimentar e acompanhamento de evolução"
            }
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
              <h3 className="text-xl font-semibold">Carregando...</h3>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
