export const calculateAge = (date_of_birth: string) => {
  if (!date_of_birth) return "";

  const birthDate = new Date(date_of_birth);

  const targetDate = new Date("30 June 2026");
  if (birthDate > targetDate) {
    return "0 Years 0 Months 0 Days";
  }

  let years = targetDate.getFullYear() - birthDate.getFullYear();

  let months = targetDate.getMonth() - birthDate.getMonth();

  let days = targetDate.getDate() - birthDate.getDate();
  if (days < 0) {
    months--;

    const previousMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      0,
    );

    days += previousMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }
  return `${years} Years ${months} Months ${days} Days`;
};

export const getFrappeError = (err: any, fallbackMessage: string = "An error occurred"): string => {
  try {
    const serverMessages = err?.response?.data?._server_messages;
    if (serverMessages) {
      const parsed = JSON.parse(serverMessages);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const firstMsg = typeof parsed[0] === 'string' ? JSON.parse(parsed[0]) : parsed[0];
        if (firstMsg && firstMsg.message) {
          return firstMsg.message.replace(/<[^>]*>/g, '').trim();
        }
      }
    }

    if (err?.response?.data?.exception) {
      const exceptionStr = err.response.data.exception;
      const parts = exceptionStr.split(':');
      const cleanMsg = parts.pop()?.trim();
      if (cleanMsg) {
        return cleanMsg.replace(/<[^>]*>/g, '').trim();
      }
    }

    if (err?.response?.data?.message) {
      return String(err.response.data.message).replace(/<[^>]*>/g, '').trim();
    }
  } catch (e) {
    console.error("Error parsing Frappe response", e);
  }
  return fallbackMessage;
};

