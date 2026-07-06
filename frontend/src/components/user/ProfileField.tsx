interface ProfileFieldProps {
  icon: string
  label: string
  value: string
}

const ProfileField = ({ icon, label, value }: ProfileFieldProps) => (
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-lg bg-[#F7EA79]/10 ring-1 ring-[#F7EA79]/20 flex items-center justify-center shrink-0">
      <i className={`${icon} text-[#F7EA79] text-sm`} aria-hidden="true" />
    </div>
    <div className="min-w-0">
      <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-white text-sm font-medium wrap-break-word">{value || '—'}</p>
    </div>
  </div>
)

export default ProfileField
