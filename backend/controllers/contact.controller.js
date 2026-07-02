import transporter from "../config/mail.config.js";

class ContactController{
    async sendContactEmail(req, res){
        try{
            const { name, surname, email, number, message } = req.body

            if(!name || !surname || !email || !number || !message){
                return res.status(400).json({ message: 'Todos los campos son obligatorios' })
            }

            const mailOptions = {
                from: email,
                to: process.env.EMAIL_USER,
                subject: 'Nuevo mensaje de contacto',
                html: `
                    <div style="margin:0;padding:0;background-color:#0A0A0A;font-family:Arial,Helvetica,sans-serif;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0A;padding:32px 16px;">
                            <tr>
                                <td align="center">
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#0F0507;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
                                        <tr>
                                            <td style="background:linear-gradient(135deg,#1C0A0E,#0F0507);padding:32px 40px;border-bottom:1px solid rgba(255,255,255,0.08);">
                                                <p style="margin:0 0 8px;color:#9B2335;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:bold;">Frigorífico 5 Estrellas</p>
                                                <h1 style="margin:0;color:#F2EDE6;font-size:24px;font-weight:bold;">Nuevo mensaje de contacto</h1>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding:32px 40px;">
                                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td style="padding:0 0 20px;">
                                                            <p style="margin:0 0 4px;color:#C9BFB5;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Nombre</p>
                                                            <p style="margin:0;color:#F2EDE6;font-size:16px;">${name} ${surname}</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding:0 0 20px;border-top:1px solid rgba(255,255,255,0.06);">
                                                            <p style="margin:20px 0 4px;color:#C9BFB5;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Email</p>
                                                            <p style="margin:0;color:#F2EDE6;font-size:16px;"><a href="mailto:${email}" style="color:#C9405A;text-decoration:none;">${email}</a></p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding:0 0 20px;border-top:1px solid rgba(255,255,255,0.06);">
                                                            <p style="margin:20px 0 4px;color:#C9BFB5;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Teléfono</p>
                                                            <p style="margin:0;color:#F2EDE6;font-size:16px;">${number}</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding:0;border-top:1px solid rgba(255,255,255,0.06);">
                                                            <p style="margin:20px 0 8px;color:#C9BFB5;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Mensaje</p>
                                                            <p style="margin:0;color:#F2EDE6;font-size:16px;line-height:1.6;background-color:#120A0C;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px 20px;">${message}</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding:20px 40px;background-color:#0C0708;border-top:1px solid rgba(255,255,255,0.08);">
                                                <p style="margin:0;color:#C9BFB5;font-size:12px;">Enviado desde el formulario de contacto de Frigorífico 5 Estrellas.</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </div>
                `
            }

            await transporter.sendMail(mailOptions)
            return res.status(200).json({ message: 'El mensaje se envio correctamente' })
        }
        catch(error){
            return res.status(500).json({ message: error.message })
        }
    }
}

const contactController = new ContactController();
export default contactController;