const DiagonalLines = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">

      <div className="absolute -top-32 -left-24 w-xl h-xl rounded-full bg-[#9B2335]/20 blur-[120px]" />

      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            -35deg,
            transparent,
            transparent 46px,
            rgba(155, 35, 53, 0.14) 46px,
            rgba(155, 35, 53, 0.14) 48px
          )`
        }}
      />
      
      <div className="absolute -top-20 left-[15%] w-0.5 h-[140%] bg-linear-to-b from-transparent via-[#9B2335]/50 to-transparent rotate-[-25deg]" />
      <div className="absolute -top-20 left-[45%] w-px h-[140%] bg-linear-to-b from-transparent via-[#9B2335]/30 to-transparent rotate-20" />
      <div className="absolute -top-20 right-[20%] w-1 h-[140%] bg-linear-to-b from-transparent via-[#9B2335]/35 to-transparent rotate-[-15deg]" />
    </div>
  )
}

export default DiagonalLines
