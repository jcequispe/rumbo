import { motion, type Variants } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1 },
}

/** Fade + "sube" desde abajo, se asienta con un leve zoom y se enfoca — una sola vez, respeta reduced-motion. */
export function Reveal({ children, delay = 0, y = 72, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y, scale: 0.96, filter: 'blur(6px)' },
        show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

type StaggerProps = {
  children: ReactNode
  className?: string
  gap?: number
}

/** Contenedor que escalona la aparición de sus hijos directos (usar con StaggerItem). */
export function Stagger({ children, className, gap = 0.08 }: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  )
}

type StaggerItemProps = {
  children: ReactNode
  className?: string
  'data-num'?: string
  style?: CSSProperties
}

export function StaggerItem({ children, className, ...rest }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={itemVariants} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} {...rest}>
      {children}
    </motion.div>
  )
}
