import { Link } from 'react-router-dom'

/** Required acceptance of privacy / data collection on forms */
export function PrivacyConsentField({
  id = 'privacyConsent',
  required = true,
}: {
  id?: string
  required?: boolean
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 text-sm leading-relaxed text-slate-400">
      <input
        id={id}
        name={id}
        type="checkbox"
        required={required}
        value="yes"
        className="mt-1 accent-cyan-400"
      />
      <span>
        I agree that Ellines Tech may collect and process the information I submit to respond to
        this request, under the{' '}
        <Link to="/privacy" className="text-brand-300 hover:text-brand-200">
          Privacy Policy
        </Link>{' '}
        and Kenya Data Protection Act, 2019. I understand I can manage cookies via the{' '}
        <Link to="/cookies" className="text-brand-300 hover:text-brand-200">
          Cookie Policy
        </Link>
        .
      </span>
    </label>
  )
}
