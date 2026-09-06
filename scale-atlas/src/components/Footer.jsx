import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.copy}>Svara — musical scales from world traditions</span>
        <nav className={styles.links}>
          <Link to="/map">Map</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/guitar?tab=tunings">Tunings</Link>
          <Link to="/guitar">Chords</Link>
        </nav>
      </div>
    </footer>
  )
}
