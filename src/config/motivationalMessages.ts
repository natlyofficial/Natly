/**
 * Motivational Messages Configuration
 * 
 * Este archivo centraliza los mensajes motivacionales según el desempeño.
 * En el futuro, estos mensajes pueden ser editados desde un dashboard admin.
 * 
 * ARQUITECTURA:
 * - Mensajes están separados por nivel de rendimiento
 * - Cada mensaje tiene título, subtítulo y emoji
 * - Fácil de conectar a una API/Firebase en el futuro
 */

export type PerformanceLevel = 
  | "no_attempt"      // 0 respuestas
  | "very_low"        // 0-39%
  | "low"             // 40-49%
  | "fair"            // 50-59%
  | "acceptable"      // 60-69%
  | "good"            // 70-79%
  | "very_good"       // 80-89%
  | "excellent";      // 90-100%

export type MotivationalMessage = {
  emoji: string;
  titleKey: string;
  subtitleKey: string;
  color: string;
};

export const MOTIVATIONAL_MESSAGES: Record<PerformanceLevel, MotivationalMessage> = {
  no_attempt: {
    emoji: "🤗",
    titleKey: "motivational.no_attempt.title",
    subtitleKey: "motivational.no_attempt.subtitle",
    color: "text-gray-600"
  },

  very_low: {
    emoji: "📚",
    titleKey: "motivational.very_low.title",
    subtitleKey: "motivational.very_low.subtitle",
    color: "text-red-600"
  },

  low: {
    emoji: "💪",
    titleKey: "motivational.low.title",
    subtitleKey: "motivational.low.subtitle",
    color: "text-orange-600"
  },

  fair: {
    emoji: "⭐",
    titleKey: "motivational.fair.title",
    subtitleKey: "motivational.fair.subtitle",
    color: "text-yellow-600"
  },

  acceptable: {
    emoji: "👍",
    titleKey: "motivational.acceptable.title",
    subtitleKey: "motivational.acceptable.subtitle",
    color: "text-lime-600"
  },

  good: {
    emoji: "🌟",
    titleKey: "motivational.good.title",
    subtitleKey: "motivational.good.subtitle",
    color: "text-green-600"
  },

  very_good: {
    emoji: "🔥",
    titleKey: "motivational.very_good.title",
    subtitleKey: "motivational.very_good.subtitle",
    color: "text-green-600"
  },

  excellent: {
    emoji: "🎉",
    titleKey: "motivational.excellent.title",
    subtitleKey: "motivational.excellent.subtitle",
    color: "text-green-700"
  }
};


/**
 * Determina el nivel de rendimiento basado en el porcentaje y número de intentos
 */
export function getPerformanceLevel(
  percentage: number,
  totalAttempted: number
): PerformanceLevel {
  // Caso especial: no respondió ninguna pregunta
  if (totalAttempted === 0) {
    return "no_attempt";
  }

  // Determinar nivel basado en porcentaje
  if (percentage >= 90) return "excellent";
  if (percentage >= 80) return "very_good";
  if (percentage >= 70) return "good";
  if (percentage >= 60) return "acceptable";
  if (percentage >= 50) return "fair";
  if (percentage >= 40) return "low";
  return "very_low";
}

/**
 * Obtiene el mensaje motivacional apropiado
 */
export function getMotivationalMessage(
  percentage: number,
  totalAttempted: number
): MotivationalMessage {
  const level = getPerformanceLevel(percentage, totalAttempted);
  return MOTIVATIONAL_MESSAGES[level];
}

/**
 * FUTURE: Función para actualizar mensajes desde dashboard
 * 
 * Esta función se conectará a Firebase/API para permitir
 * que los administradores editen los mensajes desde un dashboard
 */
export async function updateMotivationalMessage(
  level: PerformanceLevel,
  message: MotivationalMessage
): Promise<void> {
  // TODO: Implementar cuando tengamos Firebase
  // await updateDoc(doc(db, "config", "motivational-messages"), {
  //   [level]: message
  // });
  
  console.log("Future: Update message in Firebase", level, message);
}

/**
 * FUTURE: Función para cargar mensajes personalizados desde Firebase
 */
export async function loadMotivationalMessages(): Promise<Record<PerformanceLevel, MotivationalMessage>> {
  // TODO: Implementar cuando tengamos Firebase
  // const docSnap = await getDoc(doc(db, "config", "motivational-messages"));
  // return docSnap.data() as Record<PerformanceLevel, MotivationalMessage>;
  
  return MOTIVATIONAL_MESSAGES;
}