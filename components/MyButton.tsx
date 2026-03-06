import React from "react";
import { ButtonProps } from "@/types/task";

function MyButton<T>({
  value,
  onClick,
  className,
  children,
  ...rest
}: ButtonProps<T>) {
  return (
    <button onClick={() => onClick(value)} className={className} {...rest}>
      {children}
    </button>
  );
}

export default MyButton;
