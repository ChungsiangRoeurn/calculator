export default function BackspaceIcon({ size = 22, color = "#c9a86c" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 3H7C6.27 3 5.6 3.35 5.18 3.88L1.5 8.5C1.18 8.9 1 9.44 1 10V14C1 14.56 1.18 15.1 1.5 15.5L5.18 20.12C5.6 20.65 6.27 21 7 21H22C23.1 21 24 20.1 24 19V5C24 3.9 23.1 3 22 3Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 9L12 14M12 9L17 14"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}