function toValidDate(input) {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

export function formatDate(input, pattern = "PPP") {
  const date = toValidDate(input);
  if (!date) {
    return "";
  }

  if (pattern === "dd/MM/yyyy") {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }

  if (pattern === "PPP") {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  if (pattern === "MMMM dd, yyyy HH:mm") {
    const datePart = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).format(date);

    const timePart = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);

    return `${datePart} ${timePart}`;
  }

  if (pattern === "MMM dd") {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
    }).format(date);
  }

  if (pattern === "MMM yyyy") {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatDistanceToNow(input, { addSuffix = false } = {}) {
  const date = toValidDate(input);
  if (!date) {
    return "";
  }

  const now = Date.now();
  const diffMs = date.getTime() - now;
  const isFuture = diffMs > 0;
  const abs = Math.abs(diffMs);

  const units = [
    { label: "day", value: 24 * 60 * 60 * 1000 },
    { label: "hour", value: 60 * 60 * 1000 },
    { label: "minute", value: 60 * 1000 },
    { label: "second", value: 1000 },
  ];

  let selected = { label: "second", count: 0 };
  for (const unit of units) {
    if (abs >= unit.value) {
      selected = {
        label: unit.label,
        count: Math.round(abs / unit.value),
      };
      break;
    }
  }

  const plural = selected.count === 1 ? selected.label : `${selected.label}s`;
  const base = `${selected.count} ${plural}`;

  if (!addSuffix) {
    return base;
  }

  return isFuture ? `in ${base}` : `${base} ago`;
}

export function formatMonthYear(input) {
  if (!input) {
    return "";
  }

  const [year, month] = String(input).split("-");
  const numericYear = Number(year);
  const numericMonth = Number(month);

  if (!numericYear || !numericMonth) {
    return "";
  }

  const date = new Date(numericYear, numericMonth - 1, 1);
  return formatDate(date, "MMM yyyy");
}
