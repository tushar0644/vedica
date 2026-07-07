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
