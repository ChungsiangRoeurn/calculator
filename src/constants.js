export const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap";

export const OP_SYMBOLS = { "/": "÷", "*": "×", "-": "−", "+": "+" };

export const BUTTONS = [
  { label: "AC",  type: "fn",  action: "clear"   },
  { label: "+/−", type: "fn",  action: "negate"  },
  { label: "%",   type: "fn",  action: "percent" },
  { label: "÷",   type: "op",  action: "/"       },
  { label: "7",   type: "num", action: "7"        },
  { label: "8",   type: "num", action: "8"        },
  { label: "9",   type: "num", action: "9"        },
  { label: "×",   type: "op",  action: "*"        },
  { label: "4",   type: "num", action: "4"        },
  { label: "5",   type: "num", action: "5"        },
  { label: "6",   type: "num", action: "6"        },
  { label: "−",   type: "op",  action: "-"        },
  { label: "1",   type: "num", action: "1"        },
  { label: "2",   type: "num", action: "2"        },
  { label: "3",   type: "num", action: "3"        },
  { label: "+",   type: "op",  action: "+"        },
  { label: "0",   type: "num", action: "0", wide: true },
  { label: ".",   type: "num", action: "."        },
  { label: "=",   type: "eq",  action: "="        },
];