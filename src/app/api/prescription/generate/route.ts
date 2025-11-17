import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerEmail, customerPhone, checkoutId } = body

    // Gerar ID único para a receita
    const prescriptionId = `RX-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
    
    // Gerar assinatura digital
    const signature = generateDigitalSignature(prescriptionId, customerName)
    
    // Data de emissão e validade
    const issueDate = new Date()
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30) // Válida por 30 dias

    // Dados da receita
    const prescription = {
      id: prescriptionId,
      patientName: customerName,
      patientEmail: customerEmail,
      patientPhone: customerPhone,
      medication: 'Análogo GLP-1 (Semaglutida ou Liraglutida)',
      dosage: 'Conforme orientação médica',
      instructions: 'Administrar conforme prescrição. Manter refrigerado.',
      issueDate: issueDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      signature: signature,
      doctorName: 'Dr. VidaLeve',
      doctorCRM: 'CRM 123456/SP',
      checkoutId: checkoutId,
    }

    // Armazenar receita (em produção, salvar em banco de dados)
    // Por enquanto, retornar os dados
    
    return NextResponse.json({
      success: true,
      prescription: prescription,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/prescription/${prescriptionId}`,
    })
  } catch (error) {
    console.error('Erro ao gerar receita:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar receita' },
      { status: 500 }
    )
  }
}

function generateDigitalSignature(prescriptionId: string, patientName: string): string {
  const secret = process.env.PRESCRIPTION_SECRET || 'vidaleve-secret-key'
  const data = `${prescriptionId}-${patientName}-${Date.now()}`
  
  return crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex')
    .toUpperCase()
    .substring(0, 16)
}
