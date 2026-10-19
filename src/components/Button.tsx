import styles from "./Button.module.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "base" | "primary" | "secondary";
  children: React.ReactNode;
};

export const Button = ({
  variant = "base",
  type = "button",
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
};