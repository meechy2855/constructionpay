export default function PageHeader({ breadcrumb, title, description, bullets, actions }) {
  return (
    <div className="mb-6">
      {breadcrumb && (
        <p className="text-sm text-ramp-gray-500 mb-1">{breadcrumb}</p>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-ramp-gray-900 tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-ramp-gray-500 max-w-2xl">{description}</p>
          )}
          {bullets && (
            <ul className="mt-2 space-y-1">
              {bullets.map((b, i) => (
                <li key={i} className="text-sm text-ramp-gray-500 flex items-start gap-1.5">
                  <span className="text-ramp-gray-400 mt-0.5">•</span>
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
