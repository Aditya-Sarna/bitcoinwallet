import { motion } from "framer-motion";
import { Backspace } from "@phosphor-icons/react";

export default function PinPad({ value, onChange, max = 6, testidPrefix = "pin" }) {
  const press = (v) => {
    if (v === "back") {
      onChange(value.slice(0, -1));
    } else if (value.length < max) {
      onChange(value + v);
    }
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

  return (
    <div className="w-full">
      <div className="flex gap-3 justify-center mb-8" data-testid={`${testidPrefix}-dots`}>
        {Array.from({ length: max }).map((_, i) => (
          <div key={i} className={`pin-dot ${i < value.length ? "filled" : ""}`} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {keys.map((k, i) =>
          k === "" ? (
            <div key={i} />
          ) : (
            <motion.button
              key={i}
              whileTap={{ scale: 0.88 }}
              onClick={() => press(k)}
              data-testid={`${testidPrefix}-key-${k}`}
              className="h-16 rounded-2xl glass flex items-center justify-center font-mono text-2xl font-medium text-white/90 hover:bg-white/10 active:bg-white/15 transition-colors"
            >
              {k === "back" ? <Backspace size={22} /> : k}
            </motion.button>
          )
        )}
      </div>
    </div>
  );
}
