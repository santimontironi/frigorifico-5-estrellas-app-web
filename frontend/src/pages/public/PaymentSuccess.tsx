import PaymentResultLayout from '../../components/payment/PaymentResultLayout'

const PaymentSuccess = () => {
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
