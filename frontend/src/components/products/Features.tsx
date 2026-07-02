interface FeatureProps {
  icon: string
  label: string
}

const Features = ({ icon, label }: FeatureProps) => {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4 mt-10">
      <div key={label} className="flex items-center gap-2.5">
        <i className={`bi ${icon} text-[#F7EA79] text-lg`} aria-hidden="true" />
        <span className="text-[#C9BFB5] text-sm">{label}</span>
      </div>
    </div>
  )
}

export default Features
