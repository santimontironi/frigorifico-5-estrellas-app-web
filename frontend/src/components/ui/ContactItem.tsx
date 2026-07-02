interface ContactItemProps {
    icon: string
    label: string
    value: string
}

const ContactItem = ({ icon, label, value }: ContactItemProps) => {
    return (
        <div className="flex items-start gap-4">
            <span className="flex items-center justify-center h-11 w-11 shrink-0 rounded-xl border border-white/10 bg-[#120A0C] text-[#9B2335]">
                <i className={`${icon} text-lg`} aria-hidden="true" />
            </span>
            <div>
                <p className="text-[#C9BFB5] text-xs tracking-[0.2em] uppercase font-mono">{label}</p>
                <p className="text-[#F2EDE6] text-base mt-1">{value}</p>
            </div>
        </div>
    )
}

export default ContactItem
