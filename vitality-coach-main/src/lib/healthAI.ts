interface HealthLog {
  weight_kg: number | null;
  systolic_bp: number | null;
  diastolic_bp: number | null;
  blood_sugar: number | null;
  heart_rate: number | null;
  sleep_hours: number | null;
  water_intake_liters: number | null;
  exercise_minutes: number | null;
}

interface Profile {
  height_cm: number | null;
  weight_kg: number | null;
  age: number | null;
  gender: string | null;
}

interface Recommendation {
  title: string;
  message: string;
  type: "good" | "warning" | "danger";
}

export function calculateBMI(weight: number | null, height: number | null): number | null {
  if (!weight || !height || height === 0) return null;
  const heightM = height / 100;
  return weight / (heightM * heightM);
}

export function getHealthScore(log: HealthLog | undefined, bmi: number | null): number {
  if (!log) return 0;
  let score = 50; // base

  // BMI scoring
  if (bmi) {
    if (bmi >= 18.5 && bmi <= 24.9) score += 15;
    else if (bmi >= 25 && bmi <= 29.9) score += 5;
    else score -= 5;
  }

  // Heart rate
  if (log.heart_rate) {
    if (log.heart_rate >= 60 && log.heart_rate <= 100) score += 10;
    else score -= 5;
  }

  // Blood pressure
  if (log.systolic_bp && log.diastolic_bp) {
    if (log.systolic_bp < 120 && log.diastolic_bp < 80) score += 10;
    else if (log.systolic_bp < 140 && log.diastolic_bp < 90) score += 5;
    else score -= 10;
  }

  // Sleep
  if (log.sleep_hours) {
    if (log.sleep_hours >= 7 && log.sleep_hours <= 9) score += 10;
    else if (log.sleep_hours >= 6) score += 5;
    else score -= 5;
  }

  // Water
  if (log.water_intake_liters) {
    if (log.water_intake_liters >= 2) score += 5;
    else score -= 3;
  }

  // Exercise
  if (log.exercise_minutes) {
    if (log.exercise_minutes >= 30) score += 10;
    else if (log.exercise_minutes >= 15) score += 5;
  }

  // Blood sugar
  if (log.blood_sugar) {
    if (log.blood_sugar >= 70 && log.blood_sugar <= 100) score += 5;
    else if (log.blood_sugar > 126) score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

export function getHealthRecommendations(
  log: HealthLog | undefined,
  profile: Profile | null,
  bmi: number | null
): Recommendation[] {
  const recs: Recommendation[] = [];
  if (!log) return recs;

  // BMI
  if (bmi) {
    if (bmi < 18.5) {
      recs.push({ title: "Underweight", message: "Your BMI is below 18.5. Consider nutrient-dense foods and consult a dietitian.", type: "warning" });
    } else if (bmi >= 25 && bmi < 30) {
      recs.push({ title: "Overweight", message: "Your BMI suggests you're overweight. Focus on balanced meals and regular cardio exercise.", type: "warning" });
    } else if (bmi >= 30) {
      recs.push({ title: "Obesity Risk", message: "Your BMI indicates obesity. Please consult a healthcare professional for a personalized plan.", type: "danger" });
    } else {
      recs.push({ title: "Healthy BMI", message: "Great job! Your BMI is in the healthy range. Keep maintaining your balanced lifestyle.", type: "good" });
    }
  }

  // Blood pressure
  if (log.systolic_bp && log.diastolic_bp) {
    if (log.systolic_bp >= 140 || log.diastolic_bp >= 90) {
      recs.push({ title: "High Blood Pressure", message: "Your BP is elevated. Reduce sodium intake, exercise regularly, and monitor stress levels.", type: "danger" });
    } else if (log.systolic_bp >= 120 || log.diastolic_bp >= 80) {
      recs.push({ title: "Prehypertension", message: "Your BP is slightly elevated. Consider dietary changes like the DASH diet.", type: "warning" });
    }
  }

  // Blood sugar
  if (log.blood_sugar) {
    if (log.blood_sugar > 126) {
      recs.push({ title: "High Blood Sugar", message: "Your fasting blood sugar is high. Limit refined carbs and sugary foods. Consult your doctor.", type: "danger" });
    } else if (log.blood_sugar > 100) {
      recs.push({ title: "Prediabetes Range", message: "Your blood sugar is in the prediabetes range. Increase fiber intake and exercise regularly.", type: "warning" });
    }
  }

  // Heart rate
  if (log.heart_rate) {
    if (log.heart_rate > 100) {
      recs.push({ title: "Elevated Heart Rate", message: "Your resting heart rate is high. Practice deep breathing, reduce caffeine, and stay hydrated.", type: "warning" });
    } else if (log.heart_rate < 60) {
      recs.push({ title: "Low Heart Rate", message: "Your heart rate is below normal. If you're not an athlete, consult a doctor.", type: "warning" });
    }
  }

  // Sleep
  if (log.sleep_hours) {
    if (log.sleep_hours < 6) {
      recs.push({ title: "Insufficient Sleep", message: "Aim for 7-9 hours. Poor sleep increases risk of heart disease and weakens immunity.", type: "danger" });
    } else if (log.sleep_hours < 7) {
      recs.push({ title: "Improve Sleep", message: "Try to get at least 7 hours. Establish a consistent bedtime routine.", type: "warning" });
    }
  }

  // Water
  if (log.water_intake_liters) {
    if (log.water_intake_liters < 1.5) {
      recs.push({ title: "Drink More Water", message: "You're not drinking enough water. Aim for at least 2L daily for optimal hydration.", type: "warning" });
    }
  }

  // Exercise
  if (log.exercise_minutes !== null && log.exercise_minutes !== undefined) {
    if (log.exercise_minutes < 15) {
      recs.push({ title: "Increase Activity", message: "Try at least 30 minutes of moderate exercise daily. Even walking helps!", type: "warning" });
    } else if (log.exercise_minutes >= 30) {
      recs.push({ title: "Active Lifestyle", message: "Great exercise habits! Keep up the consistent activity.", type: "good" });
    }
  }

  return recs;
}
