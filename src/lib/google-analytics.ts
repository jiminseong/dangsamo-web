type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value?: number;
};

export const sendGAEvent = ({ action, category, label, value }: GTagEvent) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
