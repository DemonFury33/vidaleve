// Dados dos medicamentos análogos de GLP-1 com nomes comerciais e dosagens
export interface GLP1Medication {
  id: string
  commercialName: string
  activeIngredient: string
  dosages: string[]
  manufacturer: string
  administration: string
  frequency: string
  description: string
}

export const glp1Medications: GLP1Medication[] = [
  {
    id: "mounjaro",
    commercialName: "Mounjaro",
    activeIngredient: "Tirzepatida",
    dosages: ["2.5mg", "5mg", "7.5mg", "10mg", "12.5mg", "15mg"],
    manufacturer: "Eli Lilly",
    administration: "Subcutânea",
    frequency: "Semanal",
    description: "Agonista duplo dos receptores GIP/GLP-1"
  },
  {
    id: "ozempic",
    commercialName: "Ozempic",
    activeIngredient: "Semaglutida",
    dosages: ["0.25mg", "0.5mg", "1mg", "2mg"],
    manufacturer: "Novo Nordisk",
    administration: "Subcutânea",
    frequency: "Semanal",
    description: "Agonista do receptor GLP-1"
  },
  {
    id: "wegovy",
    commercialName: "Wegovy",
    activeIngredient: "Semaglutida",
    dosages: ["0.25mg", "0.5mg", "1mg", "1.7mg", "2.4mg"],
    manufacturer: "Novo Nordisk",
    administration: "Subcutânea",
    frequency: "Semanal",
    description: "Agonista do receptor GLP-1 para controle de peso"
  },
  {
    id: "saxenda",
    commercialName: "Saxenda",
    activeIngredient: "Liraglutida",
    dosages: ["0.6mg", "1.2mg", "1.8mg", "2.4mg", "3mg"],
    manufacturer: "Novo Nordisk",
    administration: "Subcutânea",
    frequency: "Diária",
    description: "Agonista do receptor GLP-1"
  },
  {
    id: "victoza",
    commercialName: "Victoza",
    activeIngredient: "Liraglutida",
    dosages: ["0.6mg", "1.2mg", "1.8mg"],
    manufacturer: "Novo Nordisk",
    administration: "Subcutânea",
    frequency: "Diária",
    description: "Agonista do receptor GLP-1"
  },
  {
    id: "rybelsus",
    commercialName: "Rybelsus",
    activeIngredient: "Semaglutida",
    dosages: ["3mg", "7mg", "14mg"],
    manufacturer: "Novo Nordisk",
    administration: "Oral",
    frequency: "Diária",
    description: "Agonista do receptor GLP-1 oral"
  }
]

// Função para calcular a indicação baseada no IMC e histórico
export function calculateGLP1Recommendation(
  weight: number,
  height: number,
  hasComorbidities: boolean,
  previousMedication?: string
): {
  medication: GLP1Medication
  dosage: string
  reasoning: string
} {
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)

  // Lógica de recomendação baseada em guidelines
  if (bmi >= 40 || (bmi >= 35 && hasComorbidities)) {
    // Casos mais severos - Mounjaro ou Wegovy dose alta
    return {
      medication: glp1Medications[0], // Mounjaro
      dosage: "5mg",
      reasoning: "Indicado para IMC elevado. Iniciar com dose intermediária e titular conforme tolerância e resposta."
    }
  } else if (bmi >= 30) {
    // Obesidade - Ozempic ou Wegovy
    return {
      medication: glp1Medications[1], // Ozempic
      dosage: "0.5mg",
      reasoning: "Indicado para controle de peso com perfil de segurança estabelecido. Iniciar com dose baixa."
    }
  } else if (bmi >= 27 && hasComorbidities) {
    // Sobrepeso com comorbidades
    return {
      medication: glp1Medications[2], // Wegovy
      dosage: "0.5mg",
      reasoning: "Indicado para sobrepeso com fatores de risco. Titulação gradual recomendada."
    }
  } else {
    // Casos mais leves
    return {
      medication: glp1Medications[3], // Saxenda
      dosage: "1.2mg",
      reasoning: "Opção com administração diária para controle gradual de peso."
    }
  }
}

// Função para sugerir ajuste de dosagem baseado na evolução
export function suggestDosageAdjustment(
  currentMedication: string,
  currentDosage: string,
  weightLoss: number,
  weeksOnTreatment: number,
  sideEffects: string[]
): {
  shouldAdjust: boolean
  newDosage?: string
  reasoning: string
} {
  const medication = glp1Medications.find(m => m.commercialName === currentMedication)
  if (!medication) {
    return {
      shouldAdjust: false,
      reasoning: "Medicação não encontrada"
    }
  }

  const currentDosageIndex = medication.dosages.indexOf(currentDosage)
  const hasSignificantSideEffects = sideEffects.length > 2

  // Perda de peso adequada: 0.5-1kg por semana
  const expectedWeightLoss = weeksOnTreatment * 0.75
  const isLosingAdequately = weightLoss >= expectedWeightLoss * 0.7

  // Regras de titulação baseadas em guidelines
  if (weeksOnTreatment < 4) {
    return {
      shouldAdjust: false,
      reasoning: "Aguardar pelo menos 4 semanas antes de ajustar a dose para avaliar resposta completa."
    }
  }

  if (hasSignificantSideEffects) {
    return {
      shouldAdjust: false,
      reasoning: "Manter dose atual devido a efeitos colaterais. Considerar redução se sintomas persistirem."
    }
  }

  if (!isLosingAdequately && currentDosageIndex < medication.dosages.length - 1) {
    return {
      shouldAdjust: true,
      newDosage: medication.dosages[currentDosageIndex + 1],
      reasoning: "Perda de peso abaixo do esperado. Aumentar dose gradualmente conforme protocolo de titulação."
    }
  }

  if (isLosingAdequately) {
    return {
      shouldAdjust: false,
      reasoning: "Perda de peso adequada. Manter dose atual e continuar monitoramento."
    }
  }

  return {
    shouldAdjust: false,
    reasoning: "Dose máxima atingida ou ajuste não recomendado no momento."
  }
}
