import { useMemo, useState } from 'react'
import settloLogo from './assets/settlo-logo.jpg'
import './App.css'

const QUOTATION_DATE = new Date()
const QUOTATION_DATE_VALUE = [
  QUOTATION_DATE.getFullYear(),
  String(QUOTATION_DATE.getMonth() + 1).padStart(2, '0'),
  String(QUOTATION_DATE.getDate()).padStart(2, '0'),
].join('-')
const QUOTATION_NUMBER = `SPL-Q-${QUOTATION_DATE.getFullYear()}-${String(QUOTATION_DATE.getMonth() + 1).padStart(2, '0')}${String(QUOTATION_DATE.getDate()).padStart(2, '0')}`
const DEFAULT_TERMS = [
  'An initial payment of 60% of the total package cost is required to commence the work.',
  'The remaining payment must be cleared before deployment/launch of campaigns.',
  'Cloud, Playstore, app store setup excluded.',
]

const INITIAL_COMPONENTS = [
  { id: 'admin-panel', name: 'Admin panel', days: 30, people: 1, active: true },
  { id: 'profit-list', name: 'Profit list', days: 30, people: 1, active: true },
  { id: 'customer-dashboard', name: 'Customer dashboard', days: 30, people: 1, active: true },
  { id: 'user-management', name: 'User management', days: 5, people: 1, active: true },
  { id: 'reports-analytics', name: 'Reports & analytics', days: 5, people: 1, active: true },
  { id: 'inventory-management', name: 'Inventory management', days: 5, people: 1, active: true },
  { id: 'billing-invoices', name: 'Billing & invoices', days: 5, people: 1, active: true },
  { id: 'api-integration', name: 'API integration', days: 5, people: 1, active: true },
  { id: 'quality-assurance', name: 'Quality assurance', days: 5, people: 1, active: true },
  { id: 'deployment', name: 'Deployment', days: 2, people: 1, active: true },
]

function loadComponentCatalog() {
  try {
    const savedCatalog = window.localStorage.getItem('settllo-component-catalog')
    if (!savedCatalog) return { components: INITIAL_COMPONENTS, message: '' }

    const parsedCatalog = JSON.parse(savedCatalog)
    const isValidCatalog = Array.isArray(parsedCatalog) && parsedCatalog.every((item) =>
      item &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      (typeof item.days === 'number' || typeof item.days === 'string') &&
      (typeof item.people === 'number' || typeof item.people === 'string') &&
      (item.active === undefined || typeof item.active === 'boolean'),
    )
    if (!isValidCatalog) throw new Error('Saved component list has an invalid format.')
    return {
      components: parsedCatalog.map((item) => ({ ...item, active: item.active !== false })),
      message: '',
    }
  } catch (error) {
    console.error('Unable to load saved component presets.', error)
    return {
      components: INITIAL_COMPONENTS,
      message: 'Saved components could not be loaded. Default components are shown.',
    }
  }
}

const INITIAL_ROWS = [
  { id: 1, name: 'Admin panel', days: 30, people: 1 },
  { id: 2, name: 'Profit list', days: 30, people: 1 },
]

const money = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)

const number = (value) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value || 0)

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  if (name === 'spark') {
    return <svg {...common}><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1 2.5 2.5 1-2.5 1L19 21l-1-2.5-2.5-1 2.5-1 1-2.5Z" /></svg>
  }

  if (name === 'plus') {
    return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>
  }

  if (name === 'search') {
    return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
  }

  if (name === 'trash') {
    return <svg {...common}><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" /></svg>
  }

  if (name === 'print') {
    return <svg {...common}><path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" /><path d="M7 14h10v7H7z" /><path d="M17 11h.01" /></svg>
  }

  if (name === 'reset') {
    return <svg {...common}><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" /><path d="M3 3v5h5" /></svg>
  }

  if (name === 'settings') {
    return <svg {...common}><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" /><path d="m19.4 15 .1.1a1.8 1.8 0 0 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3 .9v.2a1.8 1.8 0 0 1-3.6 0v-.2a1.8 1.8 0 0 0-3-.9l-.1.1a1.8 1.8 0 0 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0-.9-3h-.2a1.8 1.8 0 0 1 0-3.6h.2a1.8 1.8 0 0 0 .9-3l-.1-.1a1.8 1.8 0 0 1 2.5-2.5l.1.1a1.8 1.8 0 0 0 3-.9v-.2a1.8 1.8 0 0 1 3.6 0v.2a1.8 1.8 0 0 0 3 .9l.1-.1a1.8 1.8 0 0 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 .9 3h.2a1.8 1.8 0 0 1 0 3.6h-.2a1.8 1.8 0 0 0-.9 3Z" /></svg>
  }

  return null
}

function QuoteDocument({ calculations, customerDetails, projectDetails, quoteNumber, quoteDate, terms, className = '' }) {
  const hasCustomerDetails = Object.values(customerDetails).some((value) => value.trim())
  const [year, month, day] = quoteDate.split('-')
  const formattedDate = year && month && day
    ? `${day} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(month) - 1]} ${year}`
    : ''

  return (
    <div className={`quote-document ${className}`}>
      <header className="print-header">
        <div className="print-company">
          <img src={settloLogo} alt="Settlo logo" />
          <div className="print-company-details">
            <strong>SETTLO PRIVATE LIMITED - ERODE</strong>
            <span>121, Akhil Plaza, Perundurai Road,</span>
            <span>Erode, Tamil Nadu 638011</span>
            <span><b>Mobile</b> +9190036 33356</span>
            <span><b>Email</b> settlotech@gmail.com</span>
            <a href="https://www.settlo.com" target="_blank" rel="noreferrer">www.settlo.com</a>
          </div>
        </div>
        <div className="print-meta">
          <strong>QUOTATION</strong>
          <span>ORIGINAL FOR RECIPIENT</span>
        </div>
      </header>
      <div className={`quote-reference ${hasCustomerDetails ? '' : 'quote-reference-no-customer'}`}>
        {hasCustomerDetails && (
          <div className="quote-bill-to">
            <strong>Bill To:</strong>
            {customerDetails.name.trim() && <b>{customerDetails.name.trim()}</b>}
            {customerDetails.business.trim() && <span>{customerDetails.business.trim()}</span>}
            {customerDetails.mobile.trim() && <span>Ph: {customerDetails.mobile.trim()}</span>}
          </div>
        )}
        <div className="quote-id-date">
          <span><b>Quotation #:</b> {quoteNumber}</span>
          <span><b>Quotation Date:</b> {formattedDate}</span>
        </div>
      </div>
      <section className="quote-project-details" aria-label="Project details">
        <div><span>Project type</span><strong>{projectDetails.type === 'Other' ? projectDetails.customType || 'Other' : projectDetails.type}</strong></div>
        {projectDetails.type === 'Website' && <div><span>Website category</span><strong>{projectDetails.websiteCategory}</strong></div>}
      </section>
      <table className="print-table">
        <thead><tr><th>NO.</th><th>DESCRIPTION</th><th>AMOUNT (INR)</th></tr></thead>
        <tbody>
          {calculations.lineItems.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td className="print-item-name">{item.name || 'Project component'}</td>
              <td>{money(item.quotedCost)}</td>
            </tr>
          ))}
          {calculations.lineItems.length === 0 && <tr><td colSpan="3">No components have been added.</td></tr>}
        </tbody>
      </table>
      <div className="quote-bottom">
        <section className="quote-terms" aria-label="Quotation terms">
          {terms.filter((term) => term.trim()).map((term, index) => <p key={`${index}-${term}`}>• {term}</p>)}
        </section>
        <div className="print-totals">
          <div className="print-grand-total"><span>Total</span><strong>{money(calculations.total)}</strong></div>
          <span className="print-total-caption">Total amount (INR)</span>
        </div>
      </div>
      <div className="print-bottom-rule" />
    </div>
  )
}

function App() {
  const [rows, setRows] = useState(INITIAL_ROWS)
  const [storedCatalog] = useState(loadComponentCatalog)
  const [componentCatalog, setComponentCatalog] = useState(storedCatalog.components)
  const [catalogMessage, setCatalogMessage] = useState(storedCatalog.message)
  const [isComponentsOpen, setIsComponentsOpen] = useState(false)
  const [componentSearch, setComponentSearch] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [rate, setRate] = useState(750)
  const [profitPercent, setProfitPercent] = useState(50)
  const [contingencyPercent, setContingencyPercent] = useState(20)
  const [projectType, setProjectType] = useState('Website')
  const [customProjectType, setCustomProjectType] = useState('')
  const [websiteCategory, setWebsiteCategory] = useState('Dynamic')
  const [search, setSearch] = useState('')
  const [includeCustomerDetails, setIncludeCustomerDetails] = useState(false)
  const [customerDetails, setCustomerDetails] = useState({ name: '', business: '', mobile: '' })
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [quoteNumber, setQuoteNumber] = useState(QUOTATION_NUMBER)
  const [quoteDate, setQuoteDate] = useState(QUOTATION_DATE_VALUE)
  const [terms, setTerms] = useState(DEFAULT_TERMS)

  function saveComponentCatalog(nextCatalog) {
    setComponentCatalog(nextCatalog)
    try {
      window.localStorage.setItem('settllo-component-catalog', JSON.stringify(nextCatalog))
      setCatalogMessage('')
    } catch (error) {
      console.error('Unable to save component presets.', error)
      setCatalogMessage('Component changes are active, but could not be saved in this browser.')
    }
  }

  const calculations = useMemo(() => {
    const safeRate = Math.max(0, Number(rate) || 0)
    const safeProfitPercent = Math.max(0, Number(profitPercent) || 0)
    const safeContingencyPercent = Math.max(0, Number(contingencyPercent) || 0)
    const safeMultiplier = 1 + (safeProfitPercent + safeContingencyPercent) / 100
    const lineItems = rows.map((row) => {
      const days = Math.max(0, Number(row.days) || 0)
      const people = Math.max(0, Number(row.people) || 0)
      const personDays = days * people
      const baseCost = personDays * safeRate
      return {
        ...row,
        days,
        people,
        daysInput: row.days,
        peopleInput: row.people,
        personDays,
        baseCost,
        quotedCost: Math.round(baseCost * safeMultiplier),
      }
    })
    const totalDays = lineItems.reduce((sum, item) => sum + item.days, 0)
    const personDays = lineItems.reduce((sum, item) => sum + item.personDays, 0)
    const baseCost = lineItems.reduce((sum, item) => sum + item.baseCost, 0)
    const total = lineItems.reduce((sum, item) => sum + item.quotedCost, 0)
    return {
      lineItems,
      totalDays,
      personDays,
      baseCost,
      total,
      multiplier: safeMultiplier,
      profitPercent: safeProfitPercent,
      contingencyPercent: safeContingencyPercent,
      rate: safeRate,
    }
  }, [rows, rate, profitPercent, contingencyPercent])

  const matchingComponents = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return []
    return componentCatalog.filter((component) => component.active && component.name.toLowerCase().includes(query))
      .filter((component) => !rows.some((row) => row.name.toLowerCase() === component.name.toLowerCase()))
      .slice(0, 5)
  }, [search, rows, componentCatalog])

  const filteredCatalog = useMemo(() => {
    const query = componentSearch.trim().toLowerCase()
    return componentCatalog.filter((component) => component.name.toLowerCase().includes(query))
  }, [componentCatalog, componentSearch])

  function addComponent(component) {
    const componentName = (typeof component === 'string' ? component : component.name).trim()
    if (!componentName) return
    const savedComponent = componentCatalog.find((item) => item.name.toLowerCase() === componentName.toLowerCase())
    const selectedComponent = typeof component === 'object' ? component : savedComponent
    const days = selectedComponent ? Number(selectedComponent.days) || 0 : 1
    const people = selectedComponent ? Number(selectedComponent.people) || 0 : 1

    if (!savedComponent) {
      saveComponentCatalog([
        ...componentCatalog,
        { id: `component-${Date.now()}-${Math.random()}`, name: componentName, days, people, active: true },
      ])
    }
    setRows((current) => [
      ...current,
      { id: Date.now() + Math.random(), name: componentName, days, people },
    ])
    setSearch('')
  }

  function updateCatalogComponent(id, field, value) {
    saveComponentCatalog(
      componentCatalog.map((component) => component.id === id ? { ...component, [field]: value } : component),
    )
  }

  function addCatalogComponent() {
    saveComponentCatalog([
      ...componentCatalog,
      { id: `component-${Date.now()}-${Math.random()}`, name: 'New component', days: 1, people: 1, active: true },
    ])
  }

  function toggleCatalogComponent(id) {
    saveComponentCatalog(componentCatalog.map((component) =>
      component.id === id ? { ...component, active: !component.active } : component,
    ))
  }

  function updateRow(id, field, value) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    )
  }

  function updateTerm(index, value) {
    setTerms((current) => current.map((term, termIndex) => termIndex === index ? value : term))
  }

  function resetCalculator() {
    setRows(INITIAL_ROWS)
    setRate(750)
    setProfitPercent(50)
    setContingencyPercent(20)
    setSearch('')
    setComponentSearch('')
    setProjectType('Website')
    setCustomProjectType('')
    setWebsiteCategory('Dynamic')
    setIncludeCustomerDetails(false)
    setCustomerDetails({ name: '', business: '', mobile: '' })
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="https://www.settlo.com" target="_blank" rel="noreferrer" aria-label="Settlo Private Limited website">
          <img className="brand-image" src={settloLogo} alt="" />
          <span>Settlo<span className="brand-dot">.</span></span>
        </a>
        <div className="topbar-right">
          <span className="workspace-label">ESTIMATES &amp; QUOTATIONS</span>
          <span className="avatar" aria-label="Account">S</span>
        </div>
      </header>

      <div className="page-content">
        <section className="page-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" /> PROJECT WORKSPACE</div>
            <h1>Project estimate</h1>
          </div>
          <div className="heading-actions">
            <button type="button" className="button button-outline" onClick={() => setIsPreviewOpen(true)}>Preview quotation</button>
            <button type="button" className="button button-primary print-action" onClick={() => window.print()}>
              <Icon name="print" size={17} />
              Print quotation
            </button>
            <button type="button" className="button button-outline" aria-expanded={isSettingsOpen} onClick={() => setIsSettingsOpen(true)}>
              <Icon name="settings" size={16} />
              Settings
            </button>
          </div>
        </section>

        <section className="project-type-card" aria-label="Project type">
          <div className="project-type-heading">
            <h2>Project type</h2>
          </div>
          <div className="project-type-fields">
            <label className="field">
              <span>Type</span>
              <select className="text-field" value={projectType} onChange={(event) => setProjectType(event.target.value)}>
                <option>Website</option>
                <option>Web application</option>
                <option>Mobile application</option>
                <option>Other</option>
              </select>
            </label>
            {projectType === 'Website' && (
              <label className="field">
                <span>Website category</span>
                <select className="text-field" value={websiteCategory} onChange={(event) => setWebsiteCategory(event.target.value)}>
                  <option>Static</option>
                  <option>Dynamic</option>
                </select>
              </label>
            )}
            {projectType === 'Other' && (
              <label className="field">
                <span>Project type name</span>
                <input className="text-field" value={customProjectType} onChange={(event) => setCustomProjectType(event.target.value)} placeholder="Enter project type" />
              </label>
            )}
          </div>
        </section>

        <section className="customer-card" aria-label="Quotation customer details">
          <label className="customer-toggle">
            <input type="checkbox" checked={includeCustomerDetails} onChange={(event) => setIncludeCustomerDetails(event.target.checked)} />
            <span className="toggle-track" aria-hidden="true"><span /></span>
            <span className="toggle-copy"><strong>Include customer details</strong></span>
          </label>
          {includeCustomerDetails && (
            <div className="customer-fields">
              <label className="field">
                <span>Customer name</span>
                <input className="text-field" autoComplete="name" value={customerDetails.name} onChange={(event) => setCustomerDetails((current) => ({ ...current, name: event.target.value }))} placeholder="Enter customer name" />
              </label>
              <label className="field">
                <span>Business name</span>
                <input className="text-field" autoComplete="organization" value={customerDetails.business} onChange={(event) => setCustomerDetails((current) => ({ ...current, business: event.target.value }))} placeholder="Enter business name" />
              </label>
              <label className="field">
                <span>Mobile number</span>
                <input className="text-field" type="tel" autoComplete="tel" value={customerDetails.mobile} onChange={(event) => setCustomerDetails((current) => ({ ...current, mobile: event.target.value }))} placeholder="Enter mobile number" />
              </label>
            </div>
          )}
        </section>

        <div className="workspace-grid">
          <section className="components-card" aria-label="Project components">
            <div className="card-heading">
              <div>
                <div className="heading-with-icon"><span className="section-icon"><Icon name="spark" size={17} /></span><h2>Project components</h2></div>
              </div>
              <span className="component-count">{rows.length} {rows.length === 1 ? 'item' : 'items'}</span>
            </div>

            <div className="component-search">
              <div className="search-control">
                <Icon name="search" size={18} />
                <input
                  aria-label="Search components"
                  placeholder="Search components or add your own..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      addComponent(matchingComponents[0] || search)
                    }
                  }}
                />
              </div>
              <button type="button" className="button button-primary add-button" onClick={() => addComponent(matchingComponents[0] || search)}>
                <Icon name="plus" size={17} />
                Add component
              </button>
              <button type="button" className="button button-outline view-components-button" onClick={() => setIsComponentsOpen(true)}>
                View components
              </button>
              {search.trim() && (
                <div className="search-results">
                  {matchingComponents.map((component) => (
                    <button type="button" key={component.id} onClick={() => addComponent(component)}>
                      <span className="result-plus"><Icon name="plus" size={15} /></span>
                      <span>{component.name} · {component.days} days</span>
                      <span className="result-category">PRESET</span>
                    </button>
                  ))}
                  {!rows.some((row) => row.name.toLowerCase() === search.trim().toLowerCase()) &&
                    !componentCatalog.some((component) => component.name.toLowerCase() === search.trim().toLowerCase()) && (
                    <button type="button" onClick={() => addComponent(search)}>
                      <span className="result-plus"><Icon name="plus" size={15} /></span>
                      <span>Add “{search.trim()}” as a custom component</span>
                      <span className="result-category">CUSTOM</span>
                    </button>
                  )}
                  {matchingComponents.length === 0 && rows.some((row) => row.name.toLowerCase() === search.trim().toLowerCase()) && (
                    <p className="no-results">That component is already in your estimate.</p>
                  )}
                </div>
              )}
            </div>

            <div className="table-scroll">
              <table className="estimate-table">
                <thead>
                  <tr>
                    <th>COMPONENT</th>
                    <th>WORKING DAYS</th>
                    <th>PEOPLE</th>
                    <th>PERSON-DAYS</th>
                    <th className="amount-heading">ACTUAL COST</th>
                    <th><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.lineItems.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <div className="component-name-cell">
                          <span className={`component-number component-number-${index % 4}`}>{String(index + 1).padStart(2, '0')}</span>
                          <input aria-label={`Component ${index + 1} name`} value={item.name} onChange={(event) => updateRow(item.id, 'name', event.target.value)} />
                        </div>
                      </td>
                      <td><input className="number-input" aria-label={`${item.name} working days`} type="number" min="0" step="1" value={item.daysInput} onChange={(event) => updateRow(item.id, 'days', event.target.value)} /></td>
                      <td><input className="number-input people-input" aria-label={`${item.name} people involved`} type="number" min="0" step="1" value={item.peopleInput} onChange={(event) => updateRow(item.id, 'people', event.target.value)} /></td>
                      <td className="person-days-cell">{number(item.personDays)}</td>
                      <td className="cost-cell">{money(item.baseCost)}</td>
                      <td><button className="icon-button delete-button" type="button" aria-label={`Remove ${item.name || 'component'}`} onClick={() => setRows((current) => current.filter((row) => row.id !== item.id))}><Icon name="trash" size={17} /></button></td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td className="empty-row" colSpan="6">Search for a component above to start your estimate.</td></tr>
                  )}
                </tbody>
                {rows.length > 0 && (
                  <tfoot>
                    <tr>
                      <td>TOTAL</td>
                      <td>{number(calculations.totalDays)} days</td>
                      <td>—</td>
                      <td>{number(calculations.personDays)}</td>
                      <td className="cost-cell">{money(calculations.baseCost)}</td>
                      <td />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
            <div className="table-footer">
              <span>Actual cost rate: <strong>{money(calculations.rate)}</strong> per person / day</span>
              <span>Person-days = working days × people</span>
            </div>
            <section className="internal-base-estimate" aria-label="Internal base cost calculation">
              <div className="internal-base-heading">
                <h3>Base cost calculation <span>Internal</span></h3>
                <strong>{money(calculations.baseCost)}</strong>
              </div>
              <p className="internal-base-formula">
                A = working days × people × daily rate ({money(calculations.rate)})
                <span>Quotation formula: Final = A + ({calculations.profitPercent}% of A) + ({calculations.contingencyPercent}% of A) = {calculations.multiplier.toLocaleString('en-IN', { maximumFractionDigits: 2 })} × A</span>
              </p>
              <h4 className="client-amounts-heading">Client quotation amount by component</h4>
              <div className="internal-base-lines">
                {calculations.lineItems.map((item) => (
                  <div className="internal-base-line" key={item.id}>
                    <span>{item.name || 'Project component'} · {number(item.days)} days × {number(item.people)} people</span>
                    <strong>{money(item.quotedCost)}</strong>
                  </div>
                ))}
                {calculations.lineItems.length === 0 && <p className="quotation-empty">Add components to show their quotation amounts.</p>}
              </div>
              <div className="final-quotation-total">
                <div className="client-quotation-total">
                  <span>Final quotation amount</span>
                  <strong>{money(calculations.total)}</strong>
                </div>
              </div>
              <div className="estimate-actions">
                <button type="button" className="reset-button" onClick={resetCalculator}><Icon name="reset" size={15} /> Reset calculator</button>
              </div>
            </section>
          </section>
        </div>

      </div>

      {isSettingsOpen && (
        <div className="settings-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsSettingsOpen(false)
        }}>
          <aside className="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-panel-title">
            <header className="settings-panel-header">
              <h2 id="settings-panel-title">Settings</h2>
              <button type="button" className="preview-close" aria-label="Close settings" onClick={() => setIsSettingsOpen(false)}>×</button>
            </header>
            <section className="settings-card" aria-label="Calculation settings">
              <div className="settings-grid">
                <label className="field">
                  <span>Daily rate <span className="field-hint">per person</span></span>
                  <span className="input-with-prefix"><span>₹</span><input aria-label="Cost per person per day" type="number" min="0" step="1" value={rate} onChange={(event) => setRate(event.target.value)} /></span>
                </label>
                <label className="field">
                  <span>Profit addition</span>
                  <span className="input-with-suffix"><input aria-label="Profit addition percentage" type="number" min="0" step="0.1" value={profitPercent} onChange={(event) => setProfitPercent(event.target.value)} /><span>%</span></span>
                </label>
                <label className="field">
                  <span>Contingency addition</span>
                  <span className="input-with-suffix"><input aria-label="Contingency addition percentage" type="number" min="0" step="0.1" value={contingencyPercent} onChange={(event) => setContingencyPercent(event.target.value)} /><span>%</span></span>
                </label>
              </div>
              <div className="formula-note">
                <span className="formula-label">PRICING FORMULA</span>
                <span>
                  <strong>Final = A + ({calculations.profitPercent}% of A) + ({calculations.contingencyPercent}% of A) = {calculations.multiplier.toLocaleString('en-IN', { maximumFractionDigits: 2 })} × A</strong>
                  <small>A = base cost (working days × people × daily rate).</small>
                </span>
              </div>
            </section>
            <section className="settings-card quotation-settings" aria-label="Quotation details and footer terms">
              <h3>Quotation details</h3>
              <label className="field">
                <span>Quotation number</span>
                <input className="text-field" value={quoteNumber} onChange={(event) => setQuoteNumber(event.target.value)} />
              </label>
              <label className="field">
                <span>Quotation date</span>
                <input className="text-field" type="date" value={quoteDate} onChange={(event) => setQuoteDate(event.target.value)} />
              </label>
              <div className="quotation-terms-editor">
                <div className="terms-editor-heading">
                  <h3>Footer terms</h3>
                  <button type="button" className="button button-outline" onClick={() => setTerms((current) => [...current, ''])}>Add term</button>
                </div>
                {terms.map((term, index) => (
                  <div className="term-editor-row" key={`term-${index}`}>
                    <label className="sr-only" htmlFor={`quotation-term-${index}`}>Footer term {index + 1}</label>
                    <textarea id={`quotation-term-${index}`} className="text-field term-editor-input" value={term} onChange={(event) => updateTerm(index, event.target.value)} rows="3" />
                    <button type="button" className="term-remove-button" aria-label={`Remove footer term ${index + 1}`} onClick={() => setTerms((current) => current.filter((_, termIndex) => termIndex !== index))}>Remove</button>
                  </div>
                ))}
              </div>
              <button type="button" className="reset-button reset-terms-button" onClick={() => setTerms(DEFAULT_TERMS)}>Restore default terms</button>
            </section>
          </aside>
        </div>
      )}

      <section className="print-quotation" aria-label="Printable quotation">
        <QuoteDocument
          calculations={calculations}
          customerDetails={includeCustomerDetails ? customerDetails : { name: '', business: '', mobile: '' }}
          projectDetails={{ type: projectType, customType: customProjectType, websiteCategory }}
          quoteNumber={quoteNumber}
          quoteDate={quoteDate}
          terms={terms}
        />
      </section>

      {isComponentsOpen && (
        <div className="preview-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsComponentsOpen(false)
        }}>
          <section className="components-dialog" role="dialog" aria-modal="true" aria-labelledby="components-dialog-title">
            <header className="preview-toolbar">
              <div>
                <h2 id="components-dialog-title">Saved components</h2>
                <p>Edit reusable component names, default working days, and team size.</p>
              </div>
              <button type="button" className="preview-close" aria-label="Close saved components" onClick={() => setIsComponentsOpen(false)}>×</button>
            </header>
            {catalogMessage && <p className="catalog-message" role="status">{catalogMessage}</p>}
            <div className="catalog-toolbar">
              <span>{componentCatalog.filter((component) => component.active).length} active · {componentCatalog.length} total</span>
              <button type="button" className="button button-primary" onClick={addCatalogComponent}><Icon name="plus" size={16} /> New component</button>
            </div>
            <div className="catalog-search">
              <Icon name="search" size={17} />
              <input aria-label="Search saved components" value={componentSearch} onChange={(event) => setComponentSearch(event.target.value)} placeholder="Search saved components..." />
            </div>
            <div className="catalog-list">
              {filteredCatalog.map((component) => (
                <div className="catalog-row" key={component.id}>
                  <label className="field catalog-name-field">
                    <span>Component name</span>
                    <input className="text-field" value={component.name} onChange={(event) => updateCatalogComponent(component.id, 'name', event.target.value)} />
                  </label>
                  <label className="field">
                    <span>Default days</span>
                    <input className="text-field" type="number" min="0" step="1" value={component.days} onChange={(event) => updateCatalogComponent(component.id, 'days', event.target.value)} />
                  </label>
                  <label className="field">
                    <span>People</span>
                    <input className="text-field" type="number" min="0" step="1" value={component.people} onChange={(event) => updateCatalogComponent(component.id, 'people', event.target.value)} />
                  </label>
                  <button
                    type="button"
                    className={`catalog-status ${component.active ? 'is-active' : ''}`}
                    role="switch"
                    aria-checked={component.active}
                    aria-label={`${component.active ? 'Deactivate' : 'Activate'} ${component.name}`}
                    onClick={() => toggleCatalogComponent(component.id)}
                  >
                    {component.active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              ))}
              {filteredCatalog.length === 0 && <p className="catalog-empty">{componentCatalog.length === 0 ? 'No saved components yet. Use New component to create a preset.' : 'No components match your search.'}</p>}
            </div>
            <footer className="preview-footer">
              <span className="catalog-saved-note">Saved automatically in this browser</span>
              <button type="button" className="button button-outline" onClick={() => setIsComponentsOpen(false)}>Done</button>
            </footer>
          </section>
        </div>
      )}

      {isPreviewOpen && (
        <div className="preview-overlay full-page-preview" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsPreviewOpen(false)
        }}>
          <section className="preview-dialog" role="dialog" aria-modal="true" aria-labelledby="preview-title">
            <header className="preview-toolbar">
              <div><h2 id="preview-title">Quotation preview</h2><p>This is what will appear in print.</p></div>
              <button type="button" className="preview-close" aria-label="Close preview" onClick={() => setIsPreviewOpen(false)}>×</button>
            </header>
            <div className="preview-page">
              <QuoteDocument
                calculations={calculations}
                customerDetails={includeCustomerDetails ? customerDetails : { name: '', business: '', mobile: '' }}
                projectDetails={{ type: projectType, customType: customProjectType, websiteCategory }}
                quoteNumber={quoteNumber}
                quoteDate={quoteDate}
                terms={terms}
              />
            </div>
            <footer className="preview-footer">
              <button type="button" className="button button-outline" onClick={() => setIsPreviewOpen(false)}>Back to estimate</button>
              <button type="button" className="button button-primary" onClick={() => window.print()}><Icon name="print" size={17} /> Print quotation</button>
            </footer>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
