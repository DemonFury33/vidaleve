import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, productName, customerName, customerEmail, customerPhone, type } = body

    // Configuração da API da Kirvano
    const KIRVANO_API_KEY = process.env.KIRVANO_API_KEY
    const KIRVANO_API_URL = process.env.KIRVANO_API_URL || 'https://api.kirvano.com/v1'

    if (!KIRVANO_API_KEY) {
      return NextResponse.json(
        { error: 'Configuração de pagamento não encontrada' },
        { status: 500 }
      )
    }

    // Criar checkout na Kirvano
    const response = await fetch(`${KIRVANO_API_URL}/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIRVANO_API_KEY}`,
      },
      body: JSON.stringify({
        amount: amount, // Valor em centavos
        currency: 'BRL',
        product: {
          name: productName,
          description: type === 'plan' 
            ? 'Plano alimentar personalizado com indicação de análogo GLP-1'
            : 'Receita digital com assinatura válida para compra de medicamento',
        },
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
        metadata: {
          type: type, // 'plan' ou 'prescription'
          source: 'vidaleve',
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?type=${type}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Erro na API Kirvano:', data)
      return NextResponse.json(
        { error: 'Erro ao criar checkout' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      checkoutUrl: data.checkout_url || data.url,
      checkoutId: data.id,
    })
  } catch (error) {
    console.error('Erro ao processar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro interno ao processar pagamento' },
      { status: 500 }
    )
  }
}
