import PaymentResultLayout from '../../components/payment/PaymentResultLayout'

const PaymentFailure = () => {
  return (
    <PaymentResultLayout
      icon="bi-x-lg"
      iconWrap="border-[#9B2335]/50 bg-[#9B2335]/10"
      iconColor="text-[#C9405A]"
      accent="text-[#C9405A]"
      title="No se pudo completar el pago"
      message='El pago no se realizó. Tu pedido sigue disponible para pagar: podés volver a intentarlo desde "Mis pedidos".'
    />
  )
}

export default PaymentFailure
