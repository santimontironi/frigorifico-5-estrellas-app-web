interface HeroFeaturesProps {
  icon: string
  label: string
}

const HeroFeatures = ({ icon, label }: HeroFeaturesProps) => {
  return (
    <div className="flex items-center gap-2.5">
      <i className={`bi ${icon} text-[#F7EA79] text-lg`} aria-hidden="true" />
      <span className="text-[#C9BFB5] text-sm">{label}</span>
    </div>
  )
}

export default HeroFeatures
