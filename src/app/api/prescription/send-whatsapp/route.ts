import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerPhone, prescriptionUrl } = body

    // Configurar serviço de WhatsApp (exemplo com Twilio)
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
    const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'
    
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      console.warn('Credenciais Twilio não configuradas - WhatsApp não enviado')
      return NextResponse.json({ 
        success: false, 
        message: 'Serviço de WhatsApp não configurado' 
      })
    }

    // Formatar número de telefone para WhatsApp
    const formattedPhone = customerPhone.startsWith('+') 
      ? `whatsapp:${customerPhone}` 
      : `whatsapp:+55${customerPhone.replace(/\D/g, '')}`

    // Enviar mensagem via Twilio WhatsApp API
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
        },
        body: new URLSearchParams({
          From: TWILIO_WHATSAPP_NUMBER,
          To: formattedPhone,
          Body: `🏥 *VidaLeve - Receita Digital*\n\nOlá, ${customerName}!\n\nSua receita digital foi gerada com sucesso! ✅\n\n📄 Acesse sua receita aqui:\n${prescriptionUrl}\n\n✅ Válida por 30 dias\n✅ Aceita em todas as farmácias\n✅ Assinatura digital verificada\n\n⚠️ *Importante:* Guarde este link para apresentar na farmácia.\n\n_VidaLeve - Seu caminho para uma vida mais saudável_`,
        }).toString(),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Erro ao enviar WhatsApp:', data)
      return NextResponse.json({ 
        success: false, 
        error: 'Erro ao enviar WhatsApp' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      messageId: data.sid 
    })
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao enviar WhatsApp' },
      { status: 500 }
    )
  }
}
