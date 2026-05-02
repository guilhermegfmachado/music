import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.copy}>Scale Atlas — musical scales from world traditions</span>
      </div>
    </footer>
  )
}
