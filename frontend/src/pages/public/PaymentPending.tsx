import PaymentResultLayout from '../../components/payment/PaymentResultLayout'

const PaymentPending = () => {
  return (
    <PaymentResultLayout
      icon="bi-hourglass-split"
      iconWrap="border-[#F7EA79]/40 bg-[#F7EA79]/10"
      iconColor="text-[#F7EA79]"
      accent="text-[#F7EA79]"
      title="Pago pendiente"
      message='Tu pago está siendo procesado. En cuanto se acredite, tu pedido pasará a pagado automáticamente. Podés seguir su estado en "Mis pedidos".'
    />
  )
}

export default PaymentPending
