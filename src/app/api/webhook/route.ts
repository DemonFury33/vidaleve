import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verificar assinatura do webhook da Kirvano
    const signature = request.headers.get('x-kirvano-signature')
    
    // Validar webhook (implementar validação real em produção)
    if (!signature) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Processar evento de pagamento confirmado
    if (body.event === 'checkout.completed' || body.status === 'paid') {
      const { metadata, customer } = body
      
      if (metadata?.type === 'prescription') {
        // Gerar e enviar receita
        await generateAndSendPrescription({
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          checkoutId: body.id,
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}

async function generateAndSendPrescription(data: {
  customerName: string
  customerEmail: string
  customerPhone: string
  checkoutId: string
}) {
  try {
    // Gerar receita
    const prescription = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/prescription/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const prescriptionData = await prescription.json()

    // Enviar por email
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/prescription/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        prescriptionUrl: prescriptionData.url,
      }),
    })

    // Enviar por WhatsApp
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/prescription/send-whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        prescriptionUrl: prescriptionData.url,
      }),
    })

    console.log('Receita enviada com sucesso para:', data.customerEmail)
  } catch (error) {
    console.error('Erro ao gerar/enviar receita:', error)
  }
}
