'use client';

import { useRouter } from "next/navigation";
import styles from "./return.module.css";

export default function Return() {
  const router = useRouter();

  const handleReturn = () => {
    // Get the referrer (previous page)
    const referrer = document.referrer;

    // Check if the referrer is from the same origin (your website)
    const isSameOrigin = referrer && referrer.startsWith(window.location.origin);

    if (isSameOrigin) {
      // If it's from the same website, go back
      router.back();
    } else {
      // If it's from another website, go to home
      router.push('/');
    }
  }

  return (
    <button className={`${styles.button}`} onClick={handleReturn}>Voltar</button>
  )
}