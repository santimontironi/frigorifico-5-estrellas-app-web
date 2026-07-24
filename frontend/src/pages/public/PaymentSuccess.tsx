import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PaymentResultLayout from '../../components/payment/PaymentResultLayout'
import useOrder from '../../hooks/useOrder'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const { confirmPayment } = useOrder()

  // Mercado Pago vuelve con el id del pago en la URL (payment_id o collection_id).
  const paymentId = searchParams.get('payment_id') ?? searchParams.get('collection_id')

  const [confirming, setConfirming] = useState(Boolean(paymentId))
  const [failed, setFailed] = useState(false)

  // El efecto corre dos veces en StrictMode: el ref evita confirmar por duplicado.
  const alreadyConfirmed = useRef(false)

  useEffect(() => {
    if (!paymentId || alreadyConfirmed.current) return
    alreadyConfirmed.current = true

    const confirm = async () => {
      try {
        await confirmPayment(paymentId)
      } catch {
        // El webhook de Mercado Pago sigue siendo el respaldo: el pedido se
        // marca igual como pagado aunque esta confirmación falle.
        setFailed(true)
      } finally {
        setConfirming(false)
      }
    }

    confirm()
  }, [paymentId])

  if (confirming) {
    return (
      <PaymentResultLayout
        icon="bi-hourglass-split"
        iconWrap="border-[#F7EA79]/40 bg-[#F7EA79]/10"
        iconColor="text-[#F7EA79]"
        accent="text-[#F7EA79]"
        title="Confirmando tu pago..."
        message="Estamos registrando el pago de tu pedido. Esto tarda solo unos segundos."
      />
    )
  }

  if (failed) {
    return (
      <PaymentResultLayout
        icon="bi-check-lg"
        iconWrap="border-[#F7EA79]/40 bg-[#F7EA79]/10"
        iconColor="text-[#F7EA79]"
        accent="text-[#F7EA79]"
        title="¡Pago recibido!"
        message='Tu pago se procesó, pero todavía estamos terminando de registrarlo. En unos minutos vas a ver tu pedido como "Pagado" en "Mis pedidos".'
      />
    )
  }

  return (
    <PaymentResultLayout
      icon="bi-check-lg"
      iconWrap="border-[#2E7D32]/40 bg-[#2E7D32]/10"
      iconColor="text-[#5CD68A]"
      accent="text-[#5CD68A]"
      title="¡Pago aprobado!"
      message='Recibimos tu pago correctamente. Ya estamos coordinando la entrega de tu pedido. Podés ver el estado en "Mis pedidos".'
    />
  )
}

export default PaymentSuccess
