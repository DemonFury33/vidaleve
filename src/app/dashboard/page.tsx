"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  User, 
  LogOut, 
  TrendingDown, 
  Calendar, 
  Activity, 
  Pill,
  UtensilsCrossed,
  Dumbbell,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from "lucide-react"
import { calculateGLP1Recommendation, suggestDosageAdjustment, glp1Medications } from "@/lib/glp1-medications"
import { updateUserWeight, getUserWeightHistory } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import type { User as UserType } from "@/lib/supabase"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newWeight, setNewWeight] = useState("")
  const [weightHistory, setWeightHistory] = useState<Array<{ date: string; weight: number }>>([])

  useEffect(() => {
    loadUserData()
  }, [router])

  const loadUserData = async () => {
    // Verificar autenticação
    const currentUser = localStorage.getItem('vidaleve_current_user')
    if (!currentUser) {
      router.push('/auth')
      return
    }

    const userData = JSON.parse(currentUser)
    
    // Buscar dados atualizados do banco se Supabase estiver disponível
    if (supabase) {
      const { data: freshUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', userData.id)
        .single()

      if (freshUser) {
        setUser(freshUser)
        localStorage.setItem('vidaleve_current_user', JSON.stringify(freshUser))
        
        // Carregar histórico de peso
        const history = await getUserWeightHistory(freshUser.id)
        setWeightHistory(history)
      } else {
        setUser(userData)
      }
    } else {
      setUser(userData)
    }

    setIsLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('vidaleve_current_user')
    router.push('/')
  }

  const handleUpdateWeight = async () => {
    if (!user || !newWeight) return

    const weight = parseFloat(newWeight)
    if (isNaN(weight)) return

    const result = await updateUserWeight(user.id, weight)

    if (result.success) {
      // Recarregar dados
      await loadUserData()
      setNewWeight("")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Calcular recomendação GLP-1
  const glp1Recommendation = user.weight && user.height 
    ? calculateGLP1Recommendation(user.weight, user.height, false)
    : null

  // Calcular progresso
  const weightLoss = user.weight && weightHistory.length > 0
    ? weightHistory[0].weight - user.weight
    : 0

  const progressPercentage = user.weight && user.target_weight && weightHistory.length > 0
    ? Math.min(100, ((weightHistory[0].weight) - user.weight) / ((weightHistory[0].weight) - user.target_weight) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Plano {user.plan_type === "premium" ? "Premium" : "Básico"}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="medication">Medicação</TabsTrigger>
            <TabsTrigger value="nutrition">Alimentação</TabsTrigger>
            {user.plan_type === "premium" && (
              <TabsTrigger value="workout">Treinos</TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Peso Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600">
                    {user.weight ? `${user.weight}kg` : "Não informado"}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Perda Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {weightLoss > 0 ? `${weightLoss.toFixed(1)}kg` : "0kg"}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Meta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-teal-600">
                    {user.target_weight ? `${user.target_weight}kg` : "Não definida"}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress */}
            {user.target_weight && weightHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Progresso até a Meta</CardTitle>
                  <CardDescription>
                    Você está a {user.weight && user.target_weight ? (user.weight - user.target_weight).toFixed(1) : 0}kg da sua meta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={progressPercentage} className="h-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {progressPercentage.toFixed(0)}% concluído
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Update Weight */}
            <Card>
              <CardHeader>
                <CardTitle>Atualizar Peso</CardTitle>
                <CardDescription>
                  Registre seu peso regularmente para acompanhar sua evolução
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="new-weight">Novo Peso (kg)</Label>
                    <Input
                      id="new-weight"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 85.5"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleUpdateWeight} className="bg-emerald-600 hover:bg-emerald-700">
                      Atualizar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consulta Online */}
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <ExternalLink className="w-4 h-4" />
              <div className="ml-2">
                <h5 className="font-semibold text-sm">Precisa de Receita Médica?</h5>
                <p className="text-xs mt-1 mb-3">
                  Agende uma consulta online com nossos médicos parceiros para obter sua receita válida.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://consultas.nxttelessaude.com.br/busca', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Agendar Consulta
                </Button>
              </div>
            </Alert>
          </TabsContent>

          {/* Medication Tab */}
          <TabsContent value="medication" className="space-y-6">
            {glp1Recommendation ? (
              <>
                <Card className="border-emerald-200 dark:border-emerald-800">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Pill className="w-5 h-5 text-emerald-600" />
                      <CardTitle>Indicação de Medicação GLP-1</CardTitle>
                    </div>
                    <CardDescription>
                      Baseado no seu perfil e IMC
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-emerald-50 dark:bg-emerald-950 p-6 rounded-lg space-y-3">
                      <div>
                        <h3 className="text-2xl font-bold text-emerald-600">
                          {glp1Recommendation.medication.commercialName} {glp1Recommendation.dosage}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {glp1Recommendation.medication.activeIngredient} - {glp1Recommendation.medication.manufacturer}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Administração</p>
                          <p className="font-semibold">{glp1Recommendation.medication.administration}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Frequência</p>
                          <p className="font-semibold">{glp1Recommendation.medication.frequency}</p>
                        </div>
                      </div>

                      <Alert className="bg-white dark:bg-gray-800">
                        <AlertCircle className="w-4 h-4" />
                        <AlertDescription className="text-xs">
                          {glp1Recommendation.reasoning}
                        </AlertDescription>
                      </Alert>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Dosagens Disponíveis:</h4>
                      <div className="flex flex-wrap gap-2">
                        {glp1Recommendation.medication.dosages.map((dosage) => (
                          <div
                            key={dosage}
                            className={`px-3 py-1 rounded-full text-sm ${
                              dosage === glp1Recommendation.dosage
                                ? "bg-emerald-600 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {dosage}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Outras Opções de Medicação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {glp1Medications
                        .filter(med => med.id !== glp1Recommendation.medication.id)
                        .map((med) => (
                          <div key={med.id} className="p-4 border rounded-lg">
                            <h4 className="font-semibold">{med.commercialName}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{med.activeIngredient}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {med.administration} - {med.frequency}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {med.dosages.map((dosage) => (
                                <span key={dosage} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  {dosage}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <Alert>
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>
                      Complete suas informações de peso e altura na aba "Visão Geral" para receber sua indicação personalizada.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
                  <CardTitle>Plano Alimentar Personalizado</CardTitle>
                </div>
                <CardDescription>
                  10 variações de planos alimentares adaptados ao seu perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <AlertDescription>
                    Seu plano alimentar personalizado será gerado em breve com base nas suas informações e objetivos.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workout Tab (Premium only) */}
          {user.plan_type === "premium" && (
            <TabsContent value="workout" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-purple-600" />
                    <CardTitle>Plano de Treinos em Casa</CardTitle>
                  </div>
                  <CardDescription>
                    10+ variações de treinos adaptados para fazer em casa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <AlertDescription>
                      Seus treinos personalizados serão gerados em breve com base no seu nível de condicionamento e objetivos.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
