import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerEmail, prescriptionUrl } = body

    // Configurar serviço de email (exemplo com Resend)
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    
    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY não configurada - email não enviado')
      return NextResponse.json({ 
        success: false, 
        message: 'Serviço de email não configurado' 
      })
    }

    // Enviar email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'VidaLeve <noreply@vidaleve.com>',
        to: customerEmail,
        subject: '🏥 Sua Receita Digital VidaLeve',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🏥 VidaLeve</h1>
                  <p>Sua Receita Digital Está Pronta!</p>
                </div>
                <div class="content">
                  <p>Olá, <strong>${customerName}</strong>!</p>
                  
                  <p>Sua receita digital foi gerada com sucesso e está pronta para uso em qualquer farmácia do Brasil.</p>
                  
                  <p><strong>✅ Receita válida por 30 dias</strong></p>
                  <p><strong>✅ Assinatura digital verificada</strong></p>
                  <p><strong>✅ Aceita em todas as farmácias</strong></p>
                  
                  <div style="text-align: center;">
                    <a href="${prescriptionUrl}" class="button">📄 Acessar Minha Receita</a>
                  </div>
                  
                  <p style="margin-top: 30px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 5px;">
                    <strong>⚠️ Importante:</strong> Guarde este email. Você precisará apresentar a receita na farmácia para adquirir o medicamento.
                  </p>
                  
                  <p style="margin-top: 20px; font-size: 14px; color: #666;">
                    Se tiver dúvidas, responda este email ou entre em contato conosco.
                  </p>
                </div>
                <div class="footer">
                  <p>VidaLeve - Seu caminho para uma vida mais saudável</p>
                  <p>Este é um email automático, não responda.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Erro ao enviar email:', data)
      return NextResponse.json({ 
        success: false, 
        error: 'Erro ao enviar email' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      messageId: data.id 
    })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao enviar email' },
      { status: 500 }
    )
  }
}
