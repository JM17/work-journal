import * as React from "react";

const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  JSX.IntrinsicElements["textarea"]
>((props, ref) => (
  <textarea
    ref={ref}
    className="block w-full rounded-md border-gray-300 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
    rows={5}
    {...props}
  />
));

TextArea.displayName = "TextArea";
export default TextArea;
