import styles from './PageHeader.module.css'

type PageHeaderProps = {
  title: string
  description?: string
  action?: React.ReactNode
  children?: React.ReactNode
}

export function PageHeader({ title, description, action, children }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {action && <div className={styles.action}>{action}</div>}
      </div>
      {children && <div className={styles.extra}>{children}</div>}
    </header>
  )
}

export function PrimaryButton({ children }: { children: React.ReactNode }) {
  return <button type="button" className={styles.primaryBtn}>{children}</button>
}
