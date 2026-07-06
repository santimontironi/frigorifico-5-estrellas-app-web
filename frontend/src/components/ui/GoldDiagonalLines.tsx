const GoldDiagonalLines = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">

      <div className="absolute -top-32 -left-24 w-xl h-xl rounded-full bg-[#F7EA79]/6 blur-[120px]" />

      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            -35deg,
            transparent,
            transparent 58px,
            rgba(247, 234, 121, 0.04) 58px,
            rgba(247, 234, 121, 0.04) 60px
          )`
        }}
      />

      <div className="absolute -top-20 left-[15%] w-0.5 h-[140%] bg-linear-to-b from-transparent via-[#F7EA79]/20 to-transparent rotate-[-25deg]" />
      <div className="absolute -top-20 left-[45%] w-px h-[140%] bg-linear-to-b from-transparent via-[#F7EA79]/12 to-transparent rotate-20" />
      <div className="absolute -top-20 right-[20%] w-1 h-[140%] bg-linear-to-b from-transparent via-[#F7EA79]/12 to-transparent rotate-[-15deg]" />
    </div>
  )
}

export default GoldDiagonalLines
