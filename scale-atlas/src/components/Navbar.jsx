import { Link, NavLink } from 'react-router-dom'
import { NoteIcon, MoonIcon, SunIcon } from './icons.jsx'
import styles from './Navbar.module.css'

export default function Navbar({ theme, onThemeToggle }) {
  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          <NoteIcon size={18} />
          Svara
        </Link>
        <div className={styles.links}>
          <NavLink to="/" end className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
            Explore
          </NavLink>
          <NavLink to="/map" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
            Map
          </NavLink>
          <NavLink to="/tunings" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
            Tunings
          </NavLink>
          <NavLink to="/compare" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
            Compare
          </NavLink>
          <NavLink to="/practice" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
            Practice
          </NavLink>
        </div>
        <button className={styles.themeBtn} onClick={onThemeToggle} aria-label="Toggle theme">
          {theme === 'light' ? <MoonIcon size={16} /> : <SunIcon size={16} />}
        </button>
      </div>
    </nav>
  )
}
