"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert } from "@/components/ui/alert"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { 
  Scale, 
  Heart, 
  Activity, 
  Droplets, 
  FileText, 
  CreditCard, 
  CheckCircle2,
  TrendingDown,
  User,
  Calendar,
  Phone,
  Mail,
  Shield,
  Sparkles,
  Loader2,
  Dumbbell,
  ExternalLink,
  LogIn
} from "lucide-react"

type QuestionnaireData = {
  name: string
  age: string
  weight: string
  height: string
  targetWeight: string
  gender: string
  activityLevel: string
  healthConditions: string
  medications: string
  email: string
  phone: string
}

type PlanData = {
  medication: string
  dosage: string
  calories: number
  water: number
  meals: string[]
  restrictions: string[]
}

export default function Home() {
  const router = useRouter()
  const [step, setStep] = useState<"home" | "questionnaire" | "payment" | "plan">("home")
  const [questionStep, setQuestionStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium" | null>(null)
  const [formData, setFormData] = useState<QuestionnaireData>({
    name: "",
    age: "",
    weight: "",
    height: "",
    targetWeight: "",
    gender: "",
    activityLevel: "",
    healthConditions: "",
    medications: "",
    email: "",
    phone: ""
  })
  const [planData, setPlanData] = useState<PlanData | null>(null)
  const [hasPlan, setHasPlan] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const totalQuestions = 5
  const progress = (questionStep / totalQuestions) * 100

  const handleInputChange = (field: keyof QuestionnaireData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNextQuestion = () => {
    if (questionStep < totalQuestions) {
      setQuestionStep(questionStep + 1)
    } else {
      setStep("payment")
    }
  }

  const handlePreviousQuestion = () => {
    if (questionStep > 1) {
      setQuestionStep(questionStep - 1)
    }
  }

  const handlePayment = async (planType: "basic" | "premium") => {
    setIsProcessingPayment(true)
    setSelectedPlan(planType)
    
    try {
      const checkoutUrl = planType === "basic" 
        ? "https://pay.kirvano.com/8bc2c87f-63a5-4b0e-b10d-6a4ce0e986b8"
        : "https://pay.kirvano.com/9b490e6b-dc70-4128-9540-492fbe439389"
      
      // Salvar dados do usuário no localStorage para recuperar após pagamento
      localStorage.setItem('vidaleve_user_data', JSON.stringify(formData))
      localStorage.setItem('vidaleve_plan_type', planType)
      
      // Redirecionar para checkout da Kirvano
      window.location.href = checkoutUrl
    } catch (error) {
      toast.error("Erro ao processar pagamento. Tente novamente.")
      setIsProcessingPayment(false)
    }
  }

  const renderQuestionStep = () => {
    switch (questionStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Ex: 35"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Sexo</Label>
                <RadioGroup value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Masculino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Feminino</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso atual (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Ex: 85"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Ex: 170"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetWeight">Peso desejado (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  placeholder="Ex: 70"
                  value={formData.targetWeight}
                  onChange={(e) => handleInputChange("targetWeight", e.target.value)}
                />
              </div>
            </div>
            {formData.weight && formData.height && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>IMC atual:</strong> {(parseFloat(formData.weight) / Math.pow(parseFloat(formData.height) / 100, 2)).toFixed(1)}
                </p>
              </div>
            )}
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nível de atividade física</Label>
              <Select value={formData.activityLevel} onValueChange={(value) => handleInputChange("activityLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentário (pouco ou nenhum exercício)</SelectItem>
                  <SelectItem value="light">Leve (1-3 dias/semana)</SelectItem>
                  <SelectItem value="moderate">Moderado (3-5 dias/semana)</SelectItem>
                  <SelectItem value="active">Ativo (6-7 dias/semana)</SelectItem>
                  <SelectItem value="very-active">Muito ativo (2x por dia)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="healthConditions">Possui alguma condição de saúde?</Label>
              <Input
                id="healthConditions"
                placeholder="Ex: Diabetes, hipertensão, etc. (ou deixe em branco)"
                value={formData.healthConditions}
                onChange={(e) => handleInputChange("healthConditions", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medications">Faz uso de algum medicamento?</Label>
              <Input
                id="medications"
                placeholder="Liste os medicamentos (ou deixe em branco)"
                value={formData.medications}
                onChange={(e) => handleInputChange("medications", e.target.value)}
              />
            </div>
          </div>
        )
      
      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone/WhatsApp</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  if (step === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 sm:py-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Logo/Brand */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                VidaLeve
              </h1>
            </div>

            {/* Botão de Login no topo */}
            <div className="flex justify-end mb-4">
              <Button 
                variant="outline"
                className="gap-2"
                onClick={() => router.push('/auth')}
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </Button>
            </div>

            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 px-4 py-2 text-sm">
              <TrendingDown className="w-4 h-4 mr-2 inline" />
              Plataforma de Emagrecimento Personalizado
            </Badge>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
              Seu Caminho Para o
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Peso Ideal</span>
            </h2>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Receba um plano alimentar personalizado e indicação de análogo GLP-1 adequado para seu perfil, com acompanhamento profissional.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all"
                onClick={() => setStep("questionnaire")}
              >
                <Scale className="w-5 h-5 mr-2" />
                Começar Avaliação
              </Button>
              
              {hasPlan && (
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-6 text-lg border-2 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                  onClick={() => setStep("plan")}
                >
                  <Activity className="w-5 h-5 mr-2" />
                  Ver Meu Plano
                </Button>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-6xl mx-auto">
            <Card className="border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="w-10 h-10 text-emerald-600 mb-2" />
                <CardTitle className="text-lg">Avaliação Completa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Questionário detalhado para entender seu perfil e necessidades
                </p>
              </CardContent>
            </Card>

            <Card className="border-teal-200 dark:border-teal-800 hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="w-10 h-10 text-teal-600 mb-2" />
                <CardTitle className="text-lg">Plano Personalizado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Plano alimentar e medicação adequados ao seu objetivo
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Dumbbell className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Treinos em Casa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Plano de exercícios personalizados para fazer em casa
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Área do Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Acompanhe sua evolução e ajuste dosagens com segurança
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-4xl mx-auto">
            <Card className="border-2 border-emerald-300 dark:border-emerald-700 hover:shadow-2xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">Plano Básico</CardTitle>
                <CardDescription>Plano Alimentar + Indicação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-emerald-600">
                  R$ 15,99
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Questionário completo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Indicação de análogo GLP-1
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Plano alimentar personalizado
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Controle de ingestão de água
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Área do cliente com login
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Acompanhamento de evolução
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-300 dark:border-purple-700 hover:shadow-2xl transition-shadow relative">
              <div className="absolute -top-3 right-4">
                <Badge className="bg-purple-600 text-white">Mais Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Plano Premium</CardTitle>
                <CardDescription>Completo com Treinos em Casa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-purple-600">
                  R$ 29,99
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    <strong>Tudo do Plano Básico +</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    Plano de treinos em casa
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    10+ variações de treinos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    Exercícios sem equipamentos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    Acompanhamento completo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    Suporte prioritário
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (step === "questionnaire") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">Etapa {questionStep} de {totalQuestions}</Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="mb-4" />
              <CardTitle className="text-2xl">
                {questionStep === 1 && "Informações Pessoais"}
                {questionStep === 2 && "Dados Físicos"}
                {questionStep === 3 && "Atividade Física"}
                {questionStep === 4 && "Saúde"}
                {questionStep === 5 && "Contato"}
              </CardTitle>
              <CardDescription>
                {questionStep === 1 && "Vamos começar com suas informações básicas"}
                {questionStep === 2 && "Agora precisamos saber sobre seu peso e altura"}
                {questionStep === 3 && "Qual seu nível de atividade física?"}
                {questionStep === 4 && "Informações importantes sobre sua saúde"}
                {questionStep === 5 && "Como podemos entrar em contato com você?"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderQuestionStep()}

              <div className="flex gap-3 pt-4">
                {questionStep > 1 && (
                  <Button variant="outline" onClick={handlePreviousQuestion} className="flex-1">
                    Voltar
                  </Button>
                )}
                <Button 
                  onClick={handleNextQuestion} 
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  {questionStep === totalQuestions ? "Finalizar" : "Próximo"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === "payment") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Escolha Seu Plano</h2>
            <p className="text-gray-600 dark:text-gray-400">Selecione o plano ideal para sua jornada</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plano Básico */}
            <Card className="border-2 border-emerald-300 dark:border-emerald-700">
              <CardHeader>
                <CardTitle className="text-2xl">Plano Básico</CardTitle>
                <CardDescription>Plano Alimentar + Indicação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-4xl font-bold text-emerald-600">
                  R$ 15,99
                </div>
                
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Indicação de análogo GLP-1
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Plano alimentar personalizado
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Controle de hidratação
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Área do cliente com login
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Acompanhamento de evolução
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Indicação de consulta online
                  </li>
                </ul>

                <Button 
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 py-6"
                  onClick={() => handlePayment("basic")}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment && selectedPlan === "basic" ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Assinar por R$ 15,99
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Plano Premium */}
            <Card className="border-2 border-purple-300 dark:border-purple-700 relative">
              <div className="absolute -top-3 right-4">
                <Badge className="bg-purple-600 text-white">Mais Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Plano Premium</CardTitle>
                <CardDescription>Completo com Treinos em Casa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-4xl font-bold text-purple-600">
                  R$ 29,99
                </div>
                
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    <strong>Tudo do Plano Básico +</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    Plano de treinos em casa
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    10+ variações de treinos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    Exercícios sem equipamentos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    Acompanhamento completo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    Suporte prioritário
                  </li>
                </ul>

                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-6"
                  onClick={() => handlePayment("premium")}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment && selectedPlan === "premium" ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Assinar por R$ 29,99
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Alert className="mt-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <Shield className="w-4 h-4" />
            <div className="ml-2">
              <h5 className="font-semibold text-sm">Pagamento Seguro via Kirvano</h5>
              <p className="text-xs mt-1">
                Você será redirecionado para a página de checkout seguro da Kirvano
              </p>
            </div>
          </Alert>
        </div>
      </div>
    )
  }

  if (step === "plan" && planData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl">Área do Cliente</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Olá, {formData.name}! Acompanhe sua evolução
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => setStep("home")}>
                  <User className="w-4 h-4 mr-2" />
                  Início
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="medication" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
              <TabsTrigger value="medication">Medicação</TabsTrigger>
              <TabsTrigger value="nutrition">Alimentação</TabsTrigger>
              <TabsTrigger value="workout">Treinos</TabsTrigger>
              <TabsTrigger value="progress">Evolução</TabsTrigger>
              <TabsTrigger value="consultation">Consulta</TabsTrigger>
            </TabsList>

            {/* Medicação */}
            <TabsContent value="medication" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Análogo GLP-1 Recomendado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 p-6 rounded-lg">
                    <h3 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-2">
                      Ozempic 1mg
                    </h3>
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                      Dosagem inicial: <strong>0.25mg por semana</strong>
                    </p>
                  </div>

                  <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <Shield className="w-4 h-4" />
                    <div className="ml-2">
                      <h5 className="font-semibold text-sm">Ajuste de Dosagem Inteligente</h5>
                      <p className="text-xs mt-1">
                        O sistema monitora sua evolução e sugere ajustes de dosagem baseados nas diretrizes dos fabricantes
                      </p>
                    </div>
                  </Alert>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Protocolo de Titulação:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                      <li>Semanas 1-4: 0.25mg/semana</li>
                      <li>Semanas 5-8: 0.5mg/semana (se tolerado)</li>
                      <li>Semanas 9-12: 1mg/semana (dose de manutenção)</li>
                      <li>Ajustes baseados em perda de peso e tolerância</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alimentação */}
            <TabsContent value="nutrition" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-500" />
                    Plano Alimentar Personalizado
                  </CardTitle>
                  <CardDescription>Plano atual - Mês 1 de 10 variações disponíveis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-emerald-50 dark:bg-emerald-950 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-emerald-600" />
                        <span className="font-semibold">Meta Calórica</span>
                      </div>
                      <p className="text-2xl font-bold text-emerald-600">1500 kcal/dia</p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold">Hidratação</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">2.5L de água/dia</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Gerar Novo Plano Alimentar
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Treinos */}
            <TabsContent value="workout" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-blue-500" />
                    Plano de Treinos em Casa
                  </CardTitle>
                  <CardDescription>Treino atual - Variação 1 de 10 disponíveis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
                    <Sparkles className="w-4 h-4" />
                    <div className="ml-2">
                      <h5 className="font-semibold text-sm">Plano Premium Ativo</h5>
                      <p className="text-xs mt-1">
                        Você tem acesso a 10+ variações de treinos personalizados
                      </p>
                    </div>
                  </Alert>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Treino da Semana:</h4>
                    <div className="grid gap-2">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="font-medium">Segunda - Corpo Inteiro</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">30 min • Sem equipamentos</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="font-medium">Quarta - Cardio + Core</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">25 min • Intensidade moderada</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="font-medium">Sexta - Força e Resistência</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">35 min • Sem equipamentos</p>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Dumbbell className="w-4 h-4 mr-2" />
                    Gerar Nova Variação de Treino
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Evolução */}
            <TabsContent value="progress" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-blue-500" />
                    Acompanhamento de Evolução
                  </CardTitle>
                  <CardDescription>
                    Registre seu progresso para ajustes automáticos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentWeight">Peso Atual (kg)</Label>
                      <Input id="currentWeight" type="number" placeholder={formData.weight} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weekNumber">Semana</Label>
                      <Input id="weekNumber" type="number" placeholder="1" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="progressDate">Data</Label>
                      <Input id="progressDate" type="date" />
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Registrar Evolução
                  </Button>

                  <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                    <Activity className="w-4 h-4" />
                    <div className="ml-2">
                      <h5 className="font-semibold text-sm">Sistema Inteligente</h5>
                      <p className="text-xs mt-1">
                        Baseado em sua evolução, o sistema sugere ajustes de dosagem seguindo protocolos dos fabricantes (Eli Lilly e Novo Nordisk)
                      </p>
                    </div>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Consulta Online */}
            <TabsContent value="consultation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-500" />
                    Consulta Online
                  </CardTitle>
                  <CardDescription>
                    Agende sua consulta médica online
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-4 h-4" />
                    <div className="ml-2">
                      <h5 className="font-semibold text-sm">Indicação Incluída no Seu Plano</h5>
                      <p className="text-xs mt-1">
                        Você tem direito a uma indicação de consulta online com médicos especializados
                      </p>
                    </div>
                  </Alert>

                  <div className="bg-purple-50 dark:bg-purple-950 p-6 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold">Consulta Médica Online</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Agende uma consulta com médicos especializados em emagrecimento e prescrição de análogos GLP-1
                    </p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                        Consulta por videochamada
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                        Receita digital válida
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                        Acompanhamento profissional
                      </li>
                    </ul>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-6"
                    onClick={() => window.open('https://consultas.nxttelessaude.com.br/busca', '_blank')}
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Agendar Consulta Online
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    Consulta paga à parte • Valores a partir de R$ 89,90
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  return null
}
